import { X } from "lucide-react";
import { useState } from "react"

export default function MinhasDenuncias( {onClose} ) {
    const [tabAtual, setTabAtual] = useState("Em análise");

    return (
        <div className="relative h-full w-[588px] flex flex-col rounded-tl-[12px] bg-white">
             <header className="border border-x-0 border-t-0 border-b-[#e5e5e5]">
                <div className="flex justify-between items-center p-[32px]">
                    <span className="text-[20px] font-semibold text-[#3C4043]"> Minhas Denúncias </span>
                    <button onClick={onClose}> <X className="size-[24px] stroke-[#3C4043]" /> </button>
                </div>
                <div className="flex gap-[12px] w-full justify-between px-[12px]">
                    <button className={`w-1/2 py-[8px] ${tabAtual === "Em análise" && 'border-b-4 border-b-black'} transition-all`} onClick={() => setTabAtual("Em análise")} >
                        <span> Em análise </span> 
                    </button>
                    <button className={`w-1/2 py-[8px] ${tabAtual === "Concluídas" && 'border-b-4 border-b-black'} transition-all`} onClick={() => setTabAtual("Concluídas")} >
                        <span> Concluídas </span> 
                    </button>
                </div>
            </header>
        </div>
    )
}