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
import useHeader from "../../components/Header";
import digitalMarket from "../../assets/illustrations/Digital Marketing.svg"
import BusinessDeal from "../../assets/illustrations/Business Deal.svg"
import WomanFinding from "../../assets/illustrations/Woman finding something.svg"
import BusinessIdea from "../../assets/illustrations/Business Idea.svg"
import Dialogue from "../../assets/illustrations/Dialogue.svg"
import digitalDivulgation from "../../assets/illustrations/Digital Divulgation.svg"

export default function HomePage() {
    const { busca, dataInicio, dataFim, Header} = useHeader({showSearch: true, 
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
    const categoriasImgs = [
        {var: digitalMarket, style: "relative top-[8px] right-[36px]"},
        {var: BusinessDeal, style: "relative top-[19px] left-[20px]"},
        {var: WomanFinding, style: "relative top-[16px] left-[8px]"},
        {var: BusinessIdea, style: "relative top-[12px] left-[32px]"},
        {var: Dialogue, style: "relative top-[16px] left-[8px]"},
        {var: digitalDivulgation, style: "relative top-[8px] left-[4px]"},
    ]
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
        <div className="min-h-screen bg-[#F7F4EF]">
            {Header} 

            <main id="conteudo" tabIndex={-1} className="flex justify-center gap-[48px] px-[24px] pt-[130px] pb-[48px] mx-auto items-start outline-none">
                <h1 className="sr-only">Mural SMD: avisos, eventos e oportunidades da comunidade</h1>

                <div aria-hidden="true" className="hidden 2xl:block sticky top-[130px]">
                    <div className="bg-white border w-[290px] h-[270px]">

                    </div>
                </div>

                <div className="flex flex-col gap-[24px] max-w-[960px]">
                    {/* Em telas menores que 1536px a coluna lateral some: este botão garante que dá para publicar em qualquer tamanho e zoom */}
                    <div className="2xl:hidden flex flex-col md:flex-row md:items-center justify-between gap-[12px] bg-white border border-[#e5e5e5] rounded-[12px] p-[20px] md:w-[778px] font-poppins text-[#3c4043]">
                        <p><span className="font-semibold">O mural também é seu.</span> Compartilhe avisos, eventos e oportunidades com a comunidade.</p>
                        <Button variant="cta" className="shrink-0" onClick={() => { isUserLoggedIn() ? setIsPublicacaoOpen(true) : setIsLoginOpen(true) }}>
                            <Plus className="size-[20px]" />
                            <span> Criar Publicação </span>
                        </Button>
                    </div>

                    <section aria-label="Categorias de publicações" className="md:w-[778px] flex flex-col gap-[24px]">
                        <h2 className="text-[24px] font-semibold font-bricolage"> Explorar categorias de publicações </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 grid-rows-3 md:grid-rows-2 gap-[12px]">
                            {categorias.map((c, i) =>
                                <CategoriaCard
                                    key={c}
                                    texto={c}
                                    imagem={<img src={categoriasImgs[i]?.var} alt="" aria-hidden="true" className={categoriasImgs[i]?.style}/>}
                                    onClick={() => {
                                        if (categoriasSelecionadas.includes(c)) setCategoriasSelecionadas((prev) => prev.filter((item) => item != c))
                                        else setCategoriasSelecionadas((prev) => [...prev, c])
                                    }}
                                />
                            )}
                        </div>
                    </section>

                    <section aria-label="Feed de publicações" className="max-w-[778px] flex flex-col gap-[24px]">
                        <h2 className="text-[24px] font-semibold font-bricolage"> Novidades para você </h2>
                        <Feed list={filtradas} />
                    </section>
                </div>

                <aside aria-label="Criação de publicações e destaques" className="hidden 2xl:flex sticky top-[-190px] font-poppins flex-col gap-[24px] text-[#3c4043]">
                    <div className="bg-white flex flex-col gap-[12px] border w-[290px] h-[270px] p-[36px] rounded-[12px] border-[#e5e5e5]">
                        <span className="font-semibold font-bricolage text-[18px]"> O mural também é seu </span>
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