import Button from "./Button";
import { Bell, Calendar, Flag, Home, LogOut, Megaphone, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import isUserLoggedIn from "../utils/auth";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { InputSearch } from "./publicacoes/InputSearch";
import useDateRangePicker from "./DateRangePicker";
import NotificacoesModal from "./notificacoes/NotificacoesModal";
import MinhasDenuncias from "./denuncias/MinhasDenuncias";
import { getNotificacoes } from "../services/notificacoes/obterNotificacoes";
import mascararData from "../utils/mascararData";
import { isValid, parse } from "date-fns";
import validarData from "../utils/validarData";

export default function useHeader({ className, showSearch, children, onClickEntre, onClickCadastro }) {
    const navigate = useNavigate();
    const location = useLocation();

    const [isNotificacoesOpen, setIsNotificacoesOpen] = useState(false)
    const [notificacoes, setNotificacoes] = useState([])

    const [busca, setBusca] = useState("");
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const { dataInicio, setDataInicio, dataFim, setDataFim, ComponenteDate } = useDateRangePicker({ onClickX: () => { setIsCalendarOpen(false) } });
    const [dataInicioTexto, setDataInicioTexto] = useState("");
    const [dataFimTexto, setDataFimTexto] = useState("");

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
                <a href="#conteudo" className="sr-only focus:not-sr-only focus:absolute focus:left-[16px] focus:top-[16px] focus:z-50 focus:bg-white focus:px-[16px] focus:py-[8px] focus:rounded-[8px] focus:shadow-lg focus:outline-2">
                    Pular para o conteúdo
                </a>
                
                <div className="relative flex items-center gap-6 w-full">
                    <img src="/logo.svg" className="size-[40px]"/>
                    {children}
                    {showSearch &&
                        <div className="flex gap-6">
                            <InputSearch value={busca} onClickX={() => setBusca("")} onChange={(e) => { setBusca(e.target.value) }} />

                            <div className="flex items-center gap-2 border border-[#e5e5e5] px-[16px] rounded-[24px]">
                                <span className="text-principal font-medium"> Período: </span>

                                <div>
                                    <input 
                                        className="w-[90px] p-[4px]" 
                                        placeholder="Data inicial"
                                        value={dataInicio ? new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(dataInicio) : dataInicioTexto? dataInicioTexto : ""}
                                        onChange={(e) => {
                                            const dataFormatada = mascararData(e.target.value);
                                            setDataInicioTexto(dataFormatada)

                                            if (dataFormatada === "") {
                                                setDataInicio(null); 
                                            }

                                            const dataValidada = validarData(dataFormatada)

                                            if (dataValidada) {
                                                setDataInicio(dataValidada)
                                            } else {
                                                setDataInicio(null)
                                            }

                                        }}
                                        onBlur={() => setDataInicioTexto(null)}
                                    />
                                    <span> - </span>

                                    <input 
                                        className="w-[80px] p-[4px] ml-[12px]" 
                                        placeholder="Data final"
                                        value={dataFim ? new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(dataFim) : dataFimTexto? dataFimTexto : ""}
                                        onChange={(e) => {
                                            const dataFormatada = mascararData(e.target.value);
                                            setDataFimTexto(dataFormatada)

                                            if (dataFormatada === "") {
                                                setDataFim(null); 
                                            }

                                            const dataValidada = validarData(dataFormatada)

                                            if (dataValidada) {
                                                setDataFim(dataValidada)
                                            } else {
                                                setDataFim(null)
                                            }
                                        }}
                                        onBlur={() => setDataFimTexto(null)}
                                    />
                                </div>
                                <button onClick={() => { setIsCalendarOpen(!isCalendarOpen) }} aria-expanded={isCalendarOpen}> <Calendar className="stroke-principal size-[18px]" /> </button>
                            </div>

                            {isCalendarOpen && <div className="absolute z-2 left-[480px] top-[90px]"> {ComponenteDate} </div>}
                        </div>
                    }
                </div>

                {isUserLoggedIn() ?

                    <div className="flex items-center gap-[72px]">
                        <nav className="flex gap-12">
                            <Link to="/" className="group flex items-center gap-[12px]" aria-current={location.pathname === '/' ? 'page' : undefined}>
                                <Home className={`size-[20px] ${location.pathname === '/' ? 'stroke-[#39194F]' : 'stroke-[#6B6B6B] group-hover:stroke-black'}`} />
                                <span className={`${location.pathname === '/' ? 'font-semibold text-[#39194F]' : 'font-medium text-[#6B6B6B] group-hover:text-black'}`}> Início </span>
                            </Link>
                            {isUserLoggedIn().email === "casmd@virtual.ufc.br" && 
                            <Link to="/denuncias" className="group flex items-center gap-[12px]" aria-current={location.pathname === '/' ? 'page' : undefined}>
                                <Flag className={`size-[20px] ${location.pathname === '/denuncias' ? 'stroke-[#39194F]' : 'stroke-[#6B6B6B] group-hover:stroke-black'}`} />
                                <span className={`${location.pathname === '/denuncias' ? 'font-semibold text-[#39194F]' : 'font-medium text-[#6B6B6B] group-hover:text-black'}`}> Denúncias </span>
                            </Link>}
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
                                    className="flex justify-center items-center bg-destaque size-[50px] rounded-[50px] [mask-image:url(assets/Molde.svg)] mask-contain mask-no-repeat">
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
                                        <User className="stroke-[#6B6B6B] size-[16px]" />
                                        <span className="text-[#6B6B6B]"> Minha Conta </span>
                                    </Link>

                                    <div className="w-full flex justify-center"> <hr aria-hidden="true" className="border border-[#e5e5e5] w-[84%]" /> </div>

                                    <button
                                        onClick={() => setIsMinhasDenunciasOpen(true)}
                                        className="p-[16px] w-full text-left flex items-center gap-[12px] hover:bg-[rgba(60,64,67,0.06)]"
                                    >
                                        <Megaphone className="stroke-[#6B6B6B] size-[16px]" />
                                        <span className="text-[#6B6B6B]"> Minhas Denúncias </span> </button>

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
                    <div className="fixed inset-0 z-[100] flex justify-end items-center bg-black/50">
                        <NotificacoesModal onClose={() => setIsNotificacoesOpen(false)} />
                    </div>
                }

                {isMinhasDenunciasOpen &&
                    <div className="fixed inset-0 z-[100] flex justify-end items-center bg-black/50">
                        <MinhasDenuncias onClose={() => setIsMinhasDenunciasOpen(false)} />
                    </div>
                }

            </header>
        )
    }
}