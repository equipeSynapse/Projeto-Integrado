import { useState } from "react"
import gerarMatrizDias from "../../../utils/gerarMatrizDias"
import { addMonths, format, isBefore, isSameDay, startOfDay } from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { ptBR } from "date-fns/locale"

export default function SeletorData({ valor, onSelecionar }) {
    const [mes, setMes] = useState(valor || new Date())
    const dias = gerarMatrizDias(mes)
    const hoje = startOfDay(new Date())
    const mesAtual = startOfDay(new Date(hoje.getFullYear(), hoje.getMonth(), 1))
    const podeVoltar = !isBefore(addMonths(mes, -1), mesAtual)

    return (
        <div className="absolute z-10 top-[calc(100%+8px)] left-0 bg-white border border-[#e5e5e5] rounded-[8px] shadow-lg shadow-black/10 p-[16px] font-poppins text-[14px] text-[#3c4043]">
            <div className="flex items-center justify-between mb-[12px]">
                <button
                    type="button"
                    disabled={!podeVoltar}
                    onClick={() => setMes((m) => addMonths(m, -1))}
                    className={podeVoltar ? '' : 'opacity-30 cursor-not-allowed'}
                >
                    <ChevronLeft size="18px" />
                </button>
                <span className="font-semibold capitalize">{format(mes, 'MMMM yyyy', { locale: ptBR })}</span>
                <button type="button" onClick={() => setMes((m) => addMonths(m, 1))}><ChevronRight size="18px" /></button>
            </div>
            <div className="grid grid-cols-7">
                {['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'].map((d) => (
                    <span key={d} className="flex justify-center items-center w-10 h-10 text-[12px] text-[#909090]">{d}</span>
                ))}
                {dias.map((data, i) => {
                    if (!data) return <div key={i} />
                    const passado = isBefore(data, hoje)
                    const selecionado = valor && isSameDay(data, valor)
                    return (
                        <button
                            key={i}
                            type="button"
                            disabled={passado}
                            onClick={() => onSelecionar(data)}
                            className={`flex justify-center items-center w-10 h-10 rounded-[10px] ${selecionado ? 'bg-[#3c4043] text-white' : passado ? 'text-[#c4c4c4] cursor-not-allowed' : 'hover:bg-[#e5e5e5] cursor-pointer'}`}
                        >
                            {data.getDate()}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}