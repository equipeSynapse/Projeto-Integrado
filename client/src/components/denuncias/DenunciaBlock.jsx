import { Trash, Undo2 } from "lucide-react";
import { useState } from "react";

export default function DenunciaBlock({ data, excluida, onAlternar }) {
    const [conteudoExpand, setConteudoExpand] = useState(false)
    const timestampDiff = Math.round((new Date() - new Date(data.criada_em)) / (1000 * 60))
    const conteudo = data.status === "PENDENTE" ? data.descricao : data.resposta

    function expandir() {
        setConteudoExpand(true);
    }

    function recolher() {
        setConteudoExpand(false);
    }

    if (excluida) return (
        <div className={`px-[32px] py-[16px] h-[90px] flex items-center justify-between gap-[12px] border border-[#e5e5e5] 
                rounded-[8px] bg-[#F4F4F4] hover:bg-[#F4F4F4] hover:cursor-pointer`}>

            <span className="text-[16px] text-[#3C4043] font-semibold"> Denúncia excluída </span>

            <div className="h-full flex items-end">
                <button className="group flex items-center gap-[12px]" onClick={() => onAlternar(data.id)}>
                    <Undo2 className="size-[20px] stroke-[#6B6B6B] group-hover:stroke-black" />
                    <span className="text-[#6B6B6B] group-hover:text-black"> Desfazer </span>
                </button>
            </div>
        </div>
    )

    return (
        <div className="relative flex justify-between px-[32px] py-[16px] border border-[#e5e5e5] rounded-[8px] bg-white">
            <div
                className={`w-full flex items-center gap-[12px] `}
            >
                <div className="flex justify-between flex-1 text-left">
                    <div className="flex flex-col items-start w-[420px] text-[#3C4043]">
                        <h3 className="text-[16px] text-[#3C4043] font-medium">
                            {data.titulo_publicacao}
                        </h3>
                        <span className="mt-[2px]"> Motivo: {data.motivo} </span>

                    <div className="mt-[8px]">
                        {conteudo?.length > 50 ?
                            (conteudoExpand ?
                            (<p className="text-[#8D8D8D]"> 
                                {conteudo}... &nbsp; &nbsp;
                                <button onClick={() => recolher()} className="inline text-[#909090] font-medium"> 
                                    mostrar menos
                                </button>
                            </p>)
                            :
                            (<p className="text-[#8D8D8D]"> 
                                {conteudo.slice(0, conteudo.lastIndexOf(' ', 50))}... &nbsp; &nbsp;
                                <button onClick={() => expandir()} className="inline text-[#909090] font-medium"> 
                                    mostrar mais
                                </button>
                            </p>)
                            )
                            :
                            (<p> {conteudo} </p>)
                        }
                    </div>    
                    
                    </div>
                </div>
            </div>

            <div className="flex flex-col justify-between items-end whitespace-nowrap">
                <button onClick={() => onAlternar(data.id)} aria-label="Excluir Notificação">
                    <Trash className="size-[16px] stroke-atencao" />
                </button>
                <span className="text-[14px] text-[#8D8D8D] font-semibold inline-block">
                    {(timestampDiff < 60) ? `${timestampDiff} min` :
                        (timestampDiff / 60 < 24) ? `${Math.round(timestampDiff / 60)} h` :
                            `${Math.round(timestampDiff / (60 * 24))} d`}
                </span>
            </div>
        </div>
    )
}