import Button from "./Button";
import { Calendar, LogOut, User } from "lucide-react";
import { useState } from "react";
import isUserLoggedIn from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { InputSearch } from "./publicacoes/InputSearch";
import DateRangePicker from "./DateRangePicker";

export default function Header({ className, showSearch, children, onClickEntre, onClickCadastro }) {
    const navigate = useNavigate();

    const [busca, setBusca] = useState("");
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const { dataInicio, dataFim, ComponenteDate } = DateRangePicker({ onClickX: () => { setIsCalendarOpen(false) } });
    
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    return {
        busca,
        dataInicio, 
        dataFim,
        ComponenteHeader: (
        <header className={`w-full bg-white fixed z-2 h-[82px] border-b-1 border-[#e5e5e5] flex items-center px-30 justify-between font-poppins text-[14px] ${className}`}>
            <div className="relative flex items-center gap-6 w-full">
                <div> Logo </div>
                {children}
                {showSearch && 
                <div className="flex gap-6">
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
                }
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

                                <div className="w-full flex justify-center"> <hr className="border border-[#e5e5e5] w-[84%]" /> </div>

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
                    <Button variant="text" onClick={onClickEntre}> Entre </Button>
                    <Button variant="cta" onClick={onClickCadastro}> Cadastre-se </Button>
                </div>}
        </header>
    )}
}