import Button from "./Button";
import { Bell, Calendar, Home, LogOut, Megaphone, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import isUserLoggedIn from "../utils/auth";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { InputSearch } from "./publicacoes/InputSearch";
import DateRangePicker from "./DateRangePicker";
import NotificacoesModal from "./notificacoes/NotificacoesModal";
import MinhasDenuncias from "./denuncias/MinhasDenuncias";
import { getNotificacoes } from "../services/notificacoes/obterNotificacoes";

export default function useHeader({ className, showSearch, children, onClickEntre, onClickCadastro }) {
    const navigate = useNavigate();
    const location = useLocation();

    const [isNotificacoesOpen, setIsNotificacoesOpen] = useState(false)
    const [notificacoes, setNotificacoes] = useState([])

    const [busca, setBusca] = useState("");
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const { dataInicio, dataFim, ComponenteDate } = DateRangePicker({ onClickX: () => { setIsCalendarOpen(false) } });

    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isMinhasDenunciasOpen, setIsMinhasDenunciasOpen] = useState(false);

    useEffect(() => {
        if (isUserLoggedIn()) {
            getNotificacoes().then(setNotificacoes).catch(e => console.error("Erro ao buscar as notificações:", e))
        }
    }, []);

    return {
        busca,
        dataInicio,
        dataFim,
        Header: (
            <header aria-label="Cabeçalho do site" className={`w-full bg-white fixed z-2 h-[82px] border-b-1 border-[#e5e5e5] flex items-center px-30 justify-between font-poppins text-[14px] ${className} `}>
                <div className="relative flex items-center gap-6 w-full">
                    <div> Logo </div>
                    {children}
                    {showSearch &&
                        <div className="flex gap-6">
                            <InputSearch value={busca} onClickX={() => setBusca("")} onChange={(e) => { setBusca(e.target.value) }} />

                            <Button variant="second" onClick={() => { setIsCalendarOpen(!isCalendarOpen) }} aria-expanded={isCalendarOpen} aria-haspopup="dialog">
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
                    }
                </div>

                {isUserLoggedIn() ?

                    <div className="flex items-center gap-[72px]">
                        <nav className="flex gap-12">
                            <Link to="/" className="group flex items-center gap-[12px]" onClick={() => navigate("/")} aria-current={location.pathname === '/' ? 'page' : undefined}>
                                <Home className={`size-[20px] ${location.pathname === '/' ? 'stroke-black' : 'stroke-[#909090] group-hover:stroke-black'}`} />
                                <span className={`${location.pathname === '/' ? 'font-semibold' : 'font-medium text-[#909090] group-hover:text-black'}`}> Início </span>
                            </Link>
                        </nav>
                        <div className="relative">
                            <div className="flex items-center gap-[20px]">
                                <div className="relative">
                                    <button aria-label="Notificações" aria-haspopup="dialog" className="group flex items-center border p-[8px] rounded-[50px] border-[#e5e5e5] gap-[12px] hover:border-black" onClick={() => setIsNotificacoesOpen(true)}>
                                        <Bell className="size-[14px] stroke-[#909090] group-hover:stroke-black" />
                                    </button>
                                    {notificacoes.filter((n) => !n.lida).length > 0 && <div className="absolute size-[20px] text-[10px] text-white top-[-4px] right-[-2px] p-[4px] flex items-center justify-center rounded-[12px] bg-[#FF9524]">
                                        {notificacoes.filter((n) => !n.lida).length}
                                    </div>}
                                </div>
                                <div className="h-[36px] border border-[#e5e5e5]" />
                                  
                                <button 
                                    aria-label={`Menu da conta de ${isUserLoggedIn().usuario}`} 
                                    aria-expanded={isUserMenuOpen} 
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} 
                                    className="flex justify-center items-center bg-[#22D3EE] size-[50px] rounded-[50px] [mask-image:url(assets/Molde.svg)] [mask-size:contain]">
                                    <span aria-hidden="true" className="text-[20px] font-medium text-[#073061]"> {isUserLoggedIn().usuario[0].toUpperCase()} </span>
                                </button>
                            </div>
                            

                            {isUserMenuOpen &&
                                <div className="absolute flex flex-col items-start top-[80px] right-0 bg-white w-[230px] rounded-[8px] shadow-lg shadow-black/20">
                                    <Link
                                        to="/perfil"
                                        onClick={() => navigate("/perfil")}
                                        className="p-[16px] w-full text-left flex items-center gap-[12px] hover:bg-[rgba(60,64,67,0.06)]"
                                    >
                                        <User className="stroke-[#909090] size-[16px]" />
                                        <span className="text-[#909090]"> Minha Conta </span>
                                    </Link>

                                    <div className="w-full flex justify-center"> <hr aria-hidden="true" className="border border-[#e5e5e5] w-[84%]" /> </div>

                                    <button
                                        onClick={() => setIsMinhasDenunciasOpen(true)}
                                        className="p-[16px] w-full text-left flex items-center gap-[12px] hover:bg-[rgba(60,64,67,0.06)]"
                                    >
                                        <Megaphone className="stroke-[#909090] size-[16px]" />
                                        <span className="text-[#909090]"> Minhas Denúncias </span> </button>

                                    <div className="w-full flex justify-center"> <hr aria-hidden="true" className="border border-[#e5e5e5] w-[84%]" /> </div>

                                    <button
                                        onClick={() => { localStorage.removeItem("token"), window.location.reload() }}
                                        className="p-[16px] w-full text-left flex items-center gap-[12px] hover:bg-[rgba(60,64,67,0.06)]"
                                    >
                                        <LogOut className="stroke-[#ea4335] size-[16px]" />
                                        <span className="text-[#ea4335]"> Sair </span>
                                    </button>
                                </div>}
                        </div>
                    </div>
                    :
                    <div className="flex justify-between gap-[24px] items-center h-[10px] text-nowrap">
                        <Button variant="text" onClick={onClickEntre}> Entrar </Button>
                        <Button variant="cta" onClick={onClickCadastro}> Cadastre-se </Button>
                    </div>}

                {isNotificacoesOpen &&
                    <div className="fixed inset-0 z-6 flex justify-end items-center bg-black/50">
                        <NotificacoesModal onClose={() => setIsNotificacoesOpen(false)} />
                    </div>
                }

                {isMinhasDenunciasOpen &&
                    <div className="fixed inset-0 z-3 flex justify-end items-center bg-black/50">
                        <MinhasDenuncias onClose={() => setIsMinhasDenunciasOpen(false)} />
                    </div>
                }

                <div className="absolute left-0 w-full grid grid-cols-8 bottom-[-4px]">
                    <div className="bg-[#FF9524] h-[4px]" />
                    <div className="bg-[#00D640] h-[4px]" />
                    <div className="bg-[#FF2939] h-[4px]" />
                    <div className="bg-[#FFE01A] h-[4px]" />
                    <div className="bg-[#0C6BCF] h-[4px]" />
                    <div className="bg-[#9B42FA] h-[4px]" />
                    <div className="bg-[#05CCC2] h-[4px]" />
                    <div className="bg-[#FC97D2] h-[4px]" />
                </div>
            </header>
        )
    }
}