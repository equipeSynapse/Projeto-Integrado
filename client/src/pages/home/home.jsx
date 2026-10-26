import { useState, useEffect, useRef } from "react";
import { PubliCard } from "../../components/publicacoes/PubliCard";
import { getPublicacoes } from "../../services/publicacoes";
import Header from "../../components/Header";
import { InputSearch } from "../../components/publicacoes/InputSearch";
import Button from "../../components/Button";
import CadastroForm from '../../components/CadastroForm';
import LoginForm from "../../components/LoginForm";
import PublicacaoForm from "../../components/PublicacaoForm";
import { Calendar, ChevronRight, LogOut, User } from "lucide-react";
import { Plus } from "lucide-react";
import DateRangePicker from "../../components/DateRangePicker";
import isUserLoggedIn from "../../utils/auth";
import CategoriaCard from "../../components/CategoriaCard";
import Toast from "../../components/toasts/Toast";
import { useNavigate } from "react-router-dom";
import timestampMsg from "../../utils/timestampMsg";
import Destaques from "../../components/publicacoes/Destaques";

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
                // const data = [
                //     {anexos: null, autor_email: "smd@virtual.ufc.br", categoria: "Divulgação", criado_em: "2026-10-21T11:58:40.000Z", descricao: "Atenção, estudantes e pesquisadores! 🚀\n\nAs inscrições para a 15ª edição do Campus Mobile foram prorrogadas até o dia 02 de novembro de 2026!\n\nO Campus Mobile é um concurso de inovação e empreendedorismo do Instituto Claro focado no desenvolvimento de soluções para dispositivos móveis que gerem impacto social.\n\nQuem pode participar?\n    • Estudantes de graduação (cursando ou formados em 2025/2026)\n    • Alunos e egressos de mestrado e doutorado\n\nBenefícios e Prêmios:\n    • Mentoria técnica com especialistas\n    • Semana presencial imersiva com oficinas gratuitas\n    • Premiação em dinheiro\n    • Uma viagem de imersão ao Vale do Silício, na Califórnia, para os vencedores de cada categoria!\n\nCategorias deste ano:\n    • Diversidade\n    • Educação\n    • Entretenimento e Cultura\n    • Green Tech & Agtech\n    • Saúde e Tecnologias Assistivas\n    • Tecnologias Urbanas\n\nNão perca essa oportunidade de tirar sua ideia do papel e impulsionar sua carreira.\n\nConfira o regulamento completo e faça sua inscrição pelo link.", 
                //     email: null, expiracao: "2026-11-04T03:00:00.000Z", id: "9431911c-16f1-4082-b3e3-e7763e31be2c", imagem: null, link: "https://www.institutoclaro.org.br/campus-mobile/inscricoes/", nome_usuario: "Secretaria SMD", 
                //     qtd_visualizacoes: 87, telefone: null, titulo: "Inscrições Prorrogadas: Oportunidade no 15º Campus Mobile\n"},

                //     {anexos: [{nome: "Apostila 4 - Funções.pdf", tamanho: 933, tipo: "PDF", url: "https://ejwobrwwfhrnhaqhnvlb.supabase.co/storage/v1/object/sign/publicacoes_anexos/Apostila-4_Funcoes.pdf?token=eyJraWQiOiI4YmQ1Yjk3Ni1jMmVhLTQ5MTctYTM0OC1iMGQ5M2JlNGVjNGEiLCJhbGciOiJIUzUxMiJ9.eyJ1cmwiOiJwdWJsaWNhY29lc19hbmV4b3MvQXBvc3RpbGEtNF9GdW5jb2VzLnBkZiIsInNjb3BlIjoiZG93bmxvYWQiLCJpYXQiOjE3OTIzNjE2OTMsImV4cCI6MTgyMzg5NzY5M30.7l44wrYX_BMqan_omns7zmZ8Kg7YBNstYIqqkb5LVdhf6PhBOAlUoJ_lLvP09owkmWmgUFfNh0B1aqjsbEezWg"}], autor_email: "andersonmaia@alu.ufc.br", categoria: "Divulgação", criado_em: "2026-10-04T03:00:00.000Z", descricao: "Monitores da Cadeira de Programação irão realizar uma oficina sobre programação criativa em novembro.\r\n\r\nA fim de consolidar o aprendizado sobre estruturas de repetição e funções, os monitores irão realizar uma prática com os estudantes utilizando o Processing para a construção de padrões de Truchet.", email: "andersonmaiast@gmail.com", expiracao: "2026-10-30T03:00:00.000Z", id: "c1d8c347-5c99-4d8b-b90f-c6a811e4490c", 
                //     imagem: "https://ejwobrwwfhrnhaqhnvlb.supabase.co/storage/v1/object/sign/publicacoes_imgs/truchet.png?token=eyJraWQiOiI4YmQ1Yjk3Ni1jMmVhLTQ5MTctYTM0OC1iMGQ5M2JlNGVjNGEiLCJhbGciOiJIUzUxMiJ9.eyJ1cmwiOiJwdWJsaWNhY29lc19pbWdzL3RydWNoZXQucG5nIiwic2NvcGUiOiJkb3dubG9hZCIsImlhdCI6MTc5MjI3NjA3NiwiZXhwIjoxODIzODEyMDc2fQ.2o1D9MeYKDzPGwhp7AJsYsZ9jyc3PTLChXz89ikV5gaIG_zBkjJxi7ty-Zrn2zsP2sHb04BUe8KD9hKgFz69Bw", link: "https://virtual.ufc.br/", nome_usuario: "anders007", qtd_visualizacoes: 383, telefone: null, titulo: "Oficina de Programação"
                //     }
                // ]
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
            (categoriasSelecionadas.length == 0 || categoriasSelecionadas.includes(p.categoria)) &&
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
                        <section className="flex flex-col gap-[24px]">
                            {filtradas.map((p) => (
                                <PubliCard
                                    key={p.id}
                                    id={p.id}
                                    criadoEm={p.criado_em}
                                    categoria={p.categoria}
                                    imagem={p.imagem ?? null}
                                    titulo={p.titulo ?? "Sem Título"}
                                    descricao={p.descricao ?? "Sem descrição"}
                                    autor={p.nome_usuario}
                                    contato={p.contato}
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
                        onSucess={() => {
                            setIsLoginOpen(false);
                            setToastMessage("Conta criada com sucesso! Bem-vindo ao Mural.");
                        }}
                        onClickRegister={() => { setIsLoginOpen(false); setIsCadastroOpen(true) }}
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