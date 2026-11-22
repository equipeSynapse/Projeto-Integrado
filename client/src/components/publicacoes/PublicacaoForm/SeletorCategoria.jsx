import { Check, ChevronDown, ChevronUp, X } from "lucide-react";
import { useState } from "react";

export default function SeletorCategoria({ valor, onAlternar, opcoes, erro }) {
    const [categoriasAbertas, setCategoriasAbertas] = useState(false);

    return (
        <div role="group" aria-label="Seleção de Categorias" className="grid grid-cols-2 md:grid-cols-3 grid-rows-3 md:grid-rows-2 gap-[12px] w-full">
            {
                opcoes.map((c, i) => {
                    const selecionado = valor.includes(c);
                    const desabilitado = valor.length === 2 && !valor.includes(c)

                    return (
                    <button
                        key={c}
                        role="checkbox"
                        aria-checked={selecionado}
                        aria-disabled={desabilitado}
                        className="text-[12px] text-left p-[10px] border rounded-[8px] flex gap-[12px] items-center"
                        disabled={desabilitado}
                        style={{
                            backgroundColor: selecionado ? "#F0E7F6" : valor.length === 2 ? "#F5F5F5" : "white",
                            borderColor: selecionado ? "var(--color-principal)" : erro ? "var(--color-erro)" : "#e5e5e5"
                        }}
                        onClick={() => onAlternar(c)}
                    >
                        <div
                            aria-hidden="true"
                            className={`border size-[16px] bg-white rounded-[2px] flex justify-center items-center`}
                            style={{
                                borderColor: selecionado ? "var(--color-principal)" : erro ? "var(--color-erro)" : "#e5e5e5",
                                backgroundColor: selecionado ? "var(--color-principal)" : "white"
                            }}
                        >
                            {selecionado && <Check className="stroke-white" />}
                        </div>
                        {c}
                    </button>)
                }
                )}
        </div>


    )
}