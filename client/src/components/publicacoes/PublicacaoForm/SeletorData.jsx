import { useEffect, useRef, useState } from "react"
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

    const caixaRef = useRef(null)

    // Ao abrir, o foco vai para o dia selecionado (ou o primeiro dia disponível)
    useEffect(() => {
        const alvo = caixaRef.current?.querySelector('[aria-pressed="true"]') || caixaRef.current?.querySelector('button[data-dia]:not([disabled])')
        alvo?.focus()
    }, [])

    return (
       <div
            ref={caixaRef}
            role="group"
            aria-label="Calendário para escolher a data de expiração"
            // Esc fecha só o calendário: o evento não sobe até o modal, que continua aberto
            onKeyDown={(e) => { if (e.key === 'Escape') { e.stopPropagation(); onFechar?.() } }}
            className="absolute z-10 top-[calc(100%+8px)] left-0 bg-white border border-[#e5e5e5] rounded-[8px] shadow-lg shadow-black/10 p-[16px] font-poppins text-[14px] text-[#3c4043]"
        >
            <div className="flex items-center justify-between mb-[12px]">
                <button
                    type="button"
                    disabled={!podeVoltar}
                    aria-label="Ir para o mês anterior"
                    onClick={() => setMes((m) => addMonths(m, -1))}
                    className={podeVoltar ? '' : 'opacity-30 cursor-not-allowed'}
                >
                    <ChevronLeft size="18px" />
                </button>
                <span aria-live="polite" className="font-semibold capitalize">{format(mes, 'MMMM yyyy', { locale: ptBR })}</span>
                <button type="button" onClick={() => setMes((m) => addMonths(m, 1))} aria-label="Ir para o mês seguinte"><ChevronRight size="18px" /></button>
            </div>
            <div className="grid grid-cols-7">
                {['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'].map((d) => (
                    <span key={d} aria-hidden="true" className="flex justify-center items-center w-10 h-10 text-[12px] text-[#6b6b6b]">{d}</span>
                ))}
                {dias.map((data, i) => {
                    if (!data) return <div key={i} />
                    const passado = isBefore(data, hoje)
                    const selecionado = !!(valor && isSameDay(data, valor))

                    return (
                        <button
                            key={i}
                            type="button"
                            data-dia
                            disabled={passado}
                            onClick={() => onSelecionar(data)}
                            aria-label={format(data, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                            aria-pressed={selecionado}
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