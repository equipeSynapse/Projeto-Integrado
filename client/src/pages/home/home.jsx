import { useState, useEffect, useRef } from "react";
import { PubliCard } from "../../components/publicacoes/PubliCard";
import { getPublicacoes } from "../../services/publicacoes";
import Header from "../../components/Header";
import { InputSearch } from "../../components/publicacoes/InputSearch";
import Button from "../../components/Button";
import CadastroForm from '../../components/CadastroForm';
import LoginForm from "../../components/LoginForm";
import calendarIcon from "../../assets/icons/calendar.png";
import DateRangePicker from "../../components/DateRangePicker";
import isUserLoggedIn from "../../utils/auth";
import { CadastroSucessoModal } from "../../components/CadastroSucessoModal";

export default function HomePage() {
    const [busca, setBusca] = useState("");
    const [publicacoes, setPublicacoes] = useState([]);

    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const loginModalRef = useRef(null)

    const [isCadastroOpen, setIsCadastroOpen] = useState(false);
    const cadastroModalRef = useRef(null)

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
            p.titulo.toLowerCase().includes(busca.toLowerCase()) ||
            (p.nome_usuario ?? "").toLowerCase().includes(termo)
    );

    return (
        <div className="min-h-screen bg-white">
            <Header>
                <div className="flex items-center gap-6 w-full">
                    <div> Logo </div>
                    <InputSearch onKeyDown={(e) => { if (e.key === 'Enter') setBusca(e.target.value) }} />

                    <Button variant="second">
                        <img src={calendarIcon} className="size-[18px]" />
                        <span> Período </span>
                    </Button>
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
                        <Button variant="cta" onClick={() => setIsCadastroOpen(true)}> Cadastre-se </Button>
                    </div>}

            </Header>

            <main className="flex flex-col gap-[24px] px-[31px] py-[32px] max-w-[960px] mx-auto">
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
                    />
                ))}
            </main>

            {isLoginOpen && (
                <div className="fixed inset-0 flex justify-center items-center bg-black/50">
                    <LoginForm 
                        ref={loginModalRef} 
                        onClickX={() => setIsLoginOpen(false)} onSucess={() => setTimeout(() => setIsLoginOpen(false), 3000)} 
                        onClickRegister={() => {setIsLoginOpen(false); setIsCadastroOpen(true)}}
                    />
                </div>
            )}

            {isCadastroOpen && (
                <div className="fixed inset-0 flex justify-center items-center bg-black/50">
                    <CadastroForm 
                        ref={cadastroModalRef} 
                        onClickX={() => setIsCadastroOpen(false)} onSucess={() => setTimeout(() => setIsCadastroOpen(false), 3000)} 
                        onClickLoginBtn={() => {setIsCadastroOpen(false); setIsLoginOpen(true)}}
                    />
                </div>
            )}
        </div>
    );
}