import { ChevronDown, ChevronUp, X } from "lucide-react";
import { useState } from "react";

export default function SeletorCategoria({valor, onAlternar, opcoes, erro}) {
    const [categoriasAbertas, setCategoriasAbertas] = useState(false);

    return (<div className="relative w-full">
        <div
            onClick={() => setCategoriasAbertas((a) => !a)}
            className={`bg-white border border-solid rounded-[8px] ${erro ? 'border-[#ea4335]' : 'border-[#e5e5e5]'} flex items-center gap-[8px] px-[16px] py-[10px] min-h-[48px] cursor-pointer`}
        >
            <div className="flex flex-wrap gap-[4px] flex-1">
                {valor.length === 0 && <span className="text-[14px] text-[#909090]">Selecione uma ou mais opções</span>}
                {valor.map((c) => (
                    <span key={c} className="bg-[#e7e7e7] rounded-[50px] px-[8px] py-[6px] flex items-center gap-[8px] text-[12px] leading-none">
                        {c}
                        <button type="button" onClick={(e) => { e.stopPropagation(); onAlternar(c) }}><X className="size-[16px]" /></button>
                    </span>
                ))}
            </div>
            {categoriasAbertas? <ChevronUp className="size-[16px] shrink-0" />:<ChevronDown className="size-[16px] shrink-0" />}
        </div>
        {categoriasAbertas && (
            <div className="absolute z-10 top-[calc(100%+4px)] left-0 w-full bg-white border border-[#e5e5e5] rounded-[8px] shadow-lg shadow-black/10 py-[8px]">
                {opcoes.map((c) => {
                    const selecionado = valor.includes(c);

                    return (
                    <div
                        key={c}
                        type="button"
                        className="w-full text-left px-[16px] py-[10px] text-[14px] flex gap-[12px] items-center hover:bg-[rgba(60,64,67,0.06)]"
                    >
                        <input type="checkbox" checked={selecionado} onClick={() => onAlternar(c)} className="size-[16px] accent-[#3C4043] hover:cursor-pointer"/>
                        <span>{c}</span>
                    </div>
                )})}
            </div>
        )}
    </div>)
}