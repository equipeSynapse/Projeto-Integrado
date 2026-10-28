import { useState, useEffect, useRef } from "react";
import { PubliCard } from "../../components/publicacoes/PubliCard";
import { getPublicacoes } from "../../services/publicacoes";
import Header from "../../components/Header";
import { InputSearch } from "../../components/publicacoes/InputSearch";
import Button from "../../components/Button";
import CadastroForm from '../../components/CadastroForm';
import LoginForm from "../../components/LoginForm";
import { Calendar, ChevronRight, LogOut, User } from "lucide-react";
import { Plus } from "lucide-react";
import DateRangePicker from "../../components/DateRangePicker";
import EsqueciSenhaForm from "../../components/EsqueciSenhaForm";
import isUserLoggedIn from "../../utils/auth";
import CategoriaCard from "../../components/CategoriaCard";
import Toast from "../../components/toasts/Toast";
import { useNavigate } from "react-router-dom";
import Destaques from "../../components/publicacoes/Destaques";
import PublicacaoForm from "../../components/publicacoes/PublicacaoForm/PubCreationForm";

export default function HomePage() {
    const navigate = useNavigate();

    const [busca, setBusca] = useState("");
    const [publicacoes, setPublicacoes] = useState([]);

    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const loginModalRef = useRef(null)

    const [isCadastroOpen, setIsCadastroOpen] = useState(false);
    const cadastroModalRef = useRef(null)

    const [isPublicacaoOpen, setIsPublicacaoOpen] = useState(false);
    const [pubErro, setPubErro] = useState(null);

    const [isEsqueciSenhaOpen, setIsEsqueciSenhaOpen] = useState(false)

    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const { dataInicio, dataFim, ComponenteDate } = DateRangePicker({ onClickX: () => { setIsCalendarOpen(false) } });
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

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
            <Header className="fixed z-2">
                <div className="relative flex items-center gap-6 w-full">
                    <div> Logo </div>
                    <InputSearch onKeyDown={(e) => { if (e.key === 'Enter') setBusca(e.target.value) }} />

                    <Button variant="second" onClick={() => { setIsCalendarOpen(!isCalendarOpen) }}>
                        <Calendar className="size-[18px]" />
                        <span className="whitespace-nowrap">
                            {(dataInicio && dataFim) ?
                                `${new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(dataInicio)} - 
                             ${new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(dataFim)}`
                                : "Período"}
                        </span>
                    </Button>

                    {isCalendarOpen && <div className="absolute z-2 left-[480px] top-[90px]"> {ComponenteDate} </div>}
                </div>


                {isUserLoggedIn() ?
                  
                    <div className="flex items-center gap-[48px]">
                        <div className="flex gap-6">
                            <div> Início </div>
                            <div> Notificações </div>
                        </div>
                        <div className="relative">
                            <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="flex justify-center items-center bg-[#22D3EE] size-[50px] rounded-[50px]">
                                <span className="text-[20px] font-medium text-[#073061]"> {isUserLoggedIn().usuario[0].toUpperCase()} </span>
                            </button>
                            {isUserMenuOpen && 
                            <div className="absolute flex flex-col items-start top-[80px] right-0 bg-white w-[230px] rounded-[8px] shadow-lg shadow-black/20"> 
                                <button 
                                    onClick={() => navigate("/perfil")}
                                    className="p-[16px] w-full text-left flex items-center gap-[12px] hover:bg-[rgba(60,64,67,0.06)]"
                                > 
                                    <User className="stroke-[#909090] size-[16px]" /> 
                                    <span className="text-[#909090]"> Minha Conta </span> </button>

                                <div className="w-full flex justify-center"> <hr className="border border-[#e5e5e5] w-[84%]"/> </div>

                                <button 
                                    onClick={() => {localStorage.removeItem("token"), window.location.reload()}}
                                    className="p-[16px] w-full text-left flex items-center gap-[12px] hover:bg-[rgba(60,64,67,0.06)]"
                                > 
                                    <LogOut className="stroke-[#ea4335] size-[16px]"/>
                                    <span className="text-[#ea4335]"> Sair </span> 
                                </button>
                            </div>}
                        </div>   
                    </div>
                    :
                    <div className="flex justify-between gap-[24px] items-center h-[10px] text-nowrap">
                        <Button variant="text" onClick={() => setIsLoginOpen(true)}> Entre </Button>
                        <Button variant="cta" onClick={() => setIsCadastroOpen(true)}> Cadastre-se </Button>
                    </div>}

            </Header>

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
                        <section className="flex flex-col">
                            {filtradas.map((p) => (
                                <PubliCard
                                    key={p.id}
                                    id={p.id}
                                    criadoEm={p.criado_em}
                                    categoria={p.categoria}
                                    imagem={p.imagem ?? null}
                                    titulo={p.titulo ?? "Sem Título"}
                                    descricao={p.descricao ?? "Sem descrição"}
                                    link={p.link}
                                    autor={p.nome_usuario}
                                    email={p.email}
                                    anexos={p.anexos}
                                    qtdVisualizacoes={p.qtd_visualizacoes}
                                    expiracao={p.expiracao}

                                    onClickExcluir={() => console.log()}
                                />
                            ))}
                        </section>
                    </section>
                </section>

                <aside className="sticky top-[130px] font-poppins flex flex-col gap-[24px] text-[#3c4043]">
                    <div className="bg-white flex flex-col gap-[12px] border w-[290px] h-[270px] p-[36px] rounded-[12px] border-[#e5e5e5]">
                        <span className="font-semibold"> O mural também é seu </span>
                        <p> Compartilhe avisos, eventos, oportunidades ou conteúdos que podem interessar à comunidade. </p>
                        <Button variant="cta" className="w-full mt-[8px]" onClick={() => {isUserLoggedIn() ? setIsPublicacaoOpen(true) : setIsLoginOpen(true)}}> 
                            <Plus className="size-[20px]"/> 
                            <span> Criar Publicação </span> 
                        </Button>
                    </div>

                    <Destaques dataPosts={publicacoes}/>
                </aside>
            </main>

            {isLoginOpen && (
                <div className="fixed inset-0 z-3 flex justify-center items-center bg-black/50">
                    <LoginForm
                        ref={loginModalRef}
                        onClickX={() => setIsLoginOpen(false)}
                        onClickEsqueciSenha={() => {setIsLoginOpen(false); setIsEsqueciSenhaOpen(true)}}
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
                        onClickX={() => {setIsEsqueciSenhaOpen(false); setIsLoginOpen(true)}}
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