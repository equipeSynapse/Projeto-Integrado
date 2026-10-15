import { InputSearch } from "./publicacoes/InputSearch";
import Button from "./Button";
import calendarIcon from "../assets/icons/calendar.png";

export default function Header({ inputSearchValue, inputOnChange, inputOnKeyDown, children }) {
    return (
        <header className="w-full bg-white h-[82px] border-b-1 border-[#e5e5e5] flex items-center px-30 justify-between font-poppins text-[14px]">
            {children}
            {/* <div className="flex items-center gap-6 w-full">
                <div> Logo </div>
                <InputSearch value={inputSearchValue} onChange={inputOnChange} onKeyDown={inputOnKeyDown} />
                <Button variant="second">
                    <img src={calendarIcon} className="size-[18px]" />
                    <span> Período </span>
                </Button>
            </div>
            <div className="flex justify-between gap-12 text-nowrap">
                <div className="flex gap-6">
                    <div> Início </div>
                    <div> Notificações </div>
                </div>
                <div className="flex justify-between gap-[24px] items-center">
                    <Button variant="text"> Entre </Button>
                    <Button variant="cta">
                        <span> Cadastre-se </span>
                    </Button>
                </div>
            </div> */}
        </header>
    )
}