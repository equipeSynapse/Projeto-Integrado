import { useState, useEffect, useRef } from "react";
import { PubliCard } from "../../components/publicacoes/PubliCard";
import { getPublicacoes } from "../../services/publicacoes";
import Header from "../../components/Header";
import { InputSearch } from "../../components/publicacoes/InputSearch";
import Button from "../../components/Button";
import LoginForm from "../../components/LoginForm";
import calendarIcon from "../../assets/icons/calendar.png";
import isUserLoggedIn from "../../utils/auth";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronRight, Plus } from "lucide-react";
import timestampMsg from "../../utils/timestampMsg";
import Destaques from "../../components/publicacoes/Destaques";

export default function PublicacaoPage() {
    const { id } = useParams();
    const [publicacoes, setPublicacoes] = useState([]);
    const navigate = useNavigate();

    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const loginModalRef = useRef(null)

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

    const publicacao = publicacoes.filter((p) => p.id === id);

    return (
        <div className="min-h-screen bg-white">
            <Header className="fixed z-2">
                <div className="flex items-center gap-6 w-full">
                    <div> Logo </div>
                </div>


                {isUserLoggedIn() ?
                    <div className="flex justify-between gap-12">
                        <div className="flex gap-6">
                            <div> Início </div>
                            <div> Notificações </div>
                        </div>
                    </div>
                    :
                    <div className="flex justify-between gap-[24px] items-center h-[10px] text-nowrap">
                        <Button variant="text" onClick={() => setIsLoginOpen(true)}> Entre </Button>
                        <Button variant="cta">
                            <span> Cadastre-se </span>
                        </Button>
                    </div>}

            </Header>

            <main className="flex justify-center gap-[48px] px-[60px] pt-[130px] pb-[48px] mx-auto items-start">
                <aside className="sticky top-[130px]">
                    <div className="bg-white border w-[290px] h-[270px]">

                    </div>
                </aside>

                <section className="flex flex-col gap-[24px] max-w-[960px]">
                    <Button onClick={() => navigate('/')}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                        <span> Voltar à página inicial </span>
                    </Button>

                    {publicacao.map((p) => (
                        <PubliCard
                            key={p.id}
                            variant="completo"
                            id={p.id}
                            criadoEm={p.criado_em}
                            categoria={p.categoria}
                            imagem={p.imagem ?? null}
                            titulo={p.titulo ?? "Sem Título"}
                            descricao={p.descricao ?? "Sem descrição"}
                            autor={p.nome_usuario}
                            link={p.link}
                            email={p.email}
                            telefone={p.telefone}
                            anexos={p.anexos}
                            qtdVisualizacoes={p.qtd_visualizacoes}
                            expiracao={p.expiracao}
                        />
                    ))}
                </section>

                <aside className="sticky top-[130px] font-poppins flex flex-col gap-[24px] text-[#3c4043]">
                    <div className="bg-white flex flex-col gap-[12px] border w-[290px] h-[270px] p-[36px] rounded-[12px] border-[#e5e5e5]">
                        <span className="font-semibold"> O mural também é seu </span>
                        <p> Compartilhe avisos, eventos, oportunidades ou conteúdos que podem interessar à comunidade. </p>
                        <Button variant="cta" className="w-full mt-[8px]" onClick={() => {isUserLoggedIn() ? null : setIsLoginOpen(true)}}> 
                            <Plus className="size-[20px]"/> 
                            <span> Criar Publicação </span> 
                        </Button>
                    </div>

                    <Destaques dataPosts={publicacoes}/>
                </aside>
            </main>

            {isLoginOpen && (
                <div className="fixed inset-0 flex justify-center items-center bg-black/50">
                    <LoginForm ref={loginModalRef} onClickX={() => setIsLoginOpen(false)} onSucess={() => setTimeout(() => setIsLoginOpen(false), 3000)} />
                </div>
            )}
        </div>
    );
}