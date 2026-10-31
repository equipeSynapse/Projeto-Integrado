import { useState, useEffect, useRef } from "react";
import { getPublicacoes } from "../../services/publicacoes";
import Button from "../../components/Button";
import CadastroForm from '../../components/CadastroForm';
import LoginForm from "../../components/LoginForm";
import { Plus } from "lucide-react";
import EsqueciSenhaForm from "../../components/EsqueciSenhaForm";
import isUserLoggedIn from "../../utils/auth";
import CategoriaCard from "../../components/CategoriaCard";
import Toast from "../../components/toasts/Toast";
import Destaques from "../../components/publicacoes/Destaques";
import PublicacaoForm from "../../components/publicacoes/PublicacaoForm/PubCreationForm";
import Feed from "../../components/publicacoes/Feed";
import Header from "../../components/Header";

export default function HomePage() {
    const { busca, dataInicio, dataFim, ComponenteHeader} = Header({showSearch: true, 
                                                                    onClickEntre: () => setIsLoginOpen(true), 
                                                                    onClickCadastro: () => setIsCadastroOpen(true)
                                                            })

    const [publicacoes, setPublicacoes] = useState([]);

    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const loginModalRef = useRef(null)

    const [isCadastroOpen, setIsCadastroOpen] = useState(false);
    const cadastroModalRef = useRef(null)

    const [isPublicacaoOpen, setIsPublicacaoOpen] = useState(false);
    const [pubErro, setPubErro] = useState(null);

    const [isEsqueciSenhaOpen, setIsEsqueciSenhaOpen] = useState(false)

    const [toastMessage, setToastMessage] = useState(null);

    const categorias = ['Avisos Administrativos', 'Bolsas', 'Estágios', 'Eventos', 'Comunidade', 'Divulgação']
    const [categoriasSelecionadas, setCategoriasSelecionadas] = useState([])

    useEffect(() => {
        if (isLoginOpen && loginModalRef.current) {
            loginModalRef.current.focus();
        }
    }, [isLoginOpen]);


    useEffect(() => {
        const fetchPublicacoes = async () => {
            try {
                const data = await getPublicacoes();
                setPublicacoes(data);
            } catch (error) {
                console.error("Erro ao buscar publicações:", error);
            }
        };
        fetchPublicacoes();
    }, []);

    const termo = busca.toLowerCase().replace(/^@/, "");

    const filtradas = publicacoes.filter(
        (p) =>
            (p.titulo.toLowerCase().includes(busca.toLowerCase()) ||
            (p.nome_usuario ?? "").toLowerCase().includes(termo)) &&
            (categoriasSelecionadas.length == 0 || p.categoria?.some((c) => categoriasSelecionadas.includes(c))) &&
            (!dataInicio || new Date(dataInicio) <= new Date(p.criado_em)) &&
            (!dataFim || new Date(dataFim) >= new Date(p.criado_em))
    );

    return (
        <div className="min-h-screen bg-white">
            {ComponenteHeader} 

            <main className="flex justify-center gap-[48px] px-[60px] pt-[130px] pb-[48px] mx-auto items-start">
                <aside className="sticky top-[130px]">
                    <div className="bg-white border w-[290px] h-[270px]">

                    </div>
                </aside>

                <section className="flex flex-col gap-[24px] max-w-[960px]">
                    <section className="w-[778px] max-w-[778px] flex flex-col gap-[24px]">
                        <h2 className="text-[20px] font-semibold font-poppins"> Explorar categorias de publicações </h2>
                        <div className="grid grid-cols-3 grid-rows-2 gap-[12px]">
                            {categorias.map((c) =>
                                <CategoriaCard
                                    key={c}
                                    texto={c}
                                    onClick={() => {
                                        if (categoriasSelecionadas.includes(c)) setCategoriasSelecionadas((prev) => prev.filter((item) => item != c))
                                        else setCategoriasSelecionadas((prev) => [...prev, c])
                                    }}
                                />
                            )}
                        </div>
                    </section>

                    <section className="max-w-[778px] flex flex-col gap-[24px]">
                        <h2 className="text-[20px] font-semibold font-poppins"> Novidades para você </h2>
                        <Feed list={filtradas} />
                    </section>
                </section>

                <aside className="sticky top-[130px] font-poppins flex flex-col gap-[24px] text-[#3c4043]">
                    <div className="bg-white flex flex-col gap-[12px] border w-[290px] h-[270px] p-[36px] rounded-[12px] border-[#e5e5e5]">
                        <span className="font-semibold"> O mural também é seu </span>
                        <p> Compartilhe avisos, eventos, oportunidades ou conteúdos que podem interessar à comunidade. </p>
                        <Button variant="cta" className="w-full mt-[8px]" onClick={() => { isUserLoggedIn() ? setIsPublicacaoOpen(true) : setIsLoginOpen(true) }}>
                            <Plus className="size-[20px]" />
                            <span> Criar Publicação </span>
                        </Button>
                    </div>

                    <Destaques dataPosts={publicacoes} />
                </aside>
            </main>

            {isLoginOpen && (
                <div className="fixed inset-0 z-3 flex justify-center items-center bg-black/50">
                    <LoginForm
                        ref={loginModalRef}
                        onClickX={() => setIsLoginOpen(false)}
                        onClickEsqueciSenha={() => { setIsLoginOpen(false); setIsEsqueciSenhaOpen(true) }}
                        onSucess={() => {
                            setIsLoginOpen(false);
                            setToastMessage("Conta criada com sucesso! Bem-vindo ao Mural.");
                        }}
                        onClickRegister={() => { setIsLoginOpen(false); setIsCadastroOpen(true) }}
                    />
                </div>
            )}

            {isEsqueciSenhaOpen && (
                <div className="fixed inset-0 z-3 flex justify-center items-center bg-black/50">
                    <EsqueciSenhaForm
                        onClickX={() => { setIsEsqueciSenhaOpen(false); setIsLoginOpen(true) }}
                        onClickVoltar={() => { setIsEsqueciSenhaOpen(false); setIsLoginOpen(true) }}
                    />
                </div>
            )}

            {isCadastroOpen && (
                <div className="fixed inset-0 z-3 flex justify-center items-center bg-black/50">
                    <CadastroForm
                        ref={cadastroModalRef}
                        onClickX={() => setIsCadastroOpen(false)} onSucess={() => setTimeout(() => setIsCadastroOpen(false), 3000)}
                        onClickEntrar={() => { setIsCadastroOpen(false); setIsLoginOpen(true) }}
                        onClickLoginBtn={() => { setIsCadastroOpen(false); setIsLoginOpen(true) }}
                    />
                </div>
            )}

            {isPublicacaoOpen && (
                <div className="fixed inset-0 z-3 flex justify-center items-center bg-black/50 p-[16px]">
                    <PublicacaoForm
                        onClickX={() => setIsPublicacaoOpen(false)}
                        onSucess={() => { setIsPublicacaoOpen(false); window.location.reload() }}
                        onErro={(mensagem) => setPubErro(mensagem)}
                    />
                </div>
            )}

            {pubErro &&
                <Toast titulo="Erro ao criar publicação" mensagem={pubErro} onClose={() => setPubErro(null)} />
            }

            {toastMessage &&
                <Toast titulo="Boas-vindas ao Mural SMD!" mensagem="Seu login foi realizado com sucesso." onClose={() => setToastMessage(false)} />
            }
        </div>
    );
}