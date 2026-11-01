import { Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { marcarComoLida } from "../../services/notificacoes/marcarComoLida";

export default function NotificacaoBlock( { data, onClick } ) {
    const navigate = useNavigate();
    const timestampDiff = Math.round((new Date() - new Date(data.gerada_em))/(1000 * 60))

    return (
        <div 
            className={`px-[32px] py-[16px] h-[90px] flex items-center gap-[12px] border border-[#e5e5e5] rounded-[8px] 
                        ${data.lida ? 'bg-[#F4F4F4]':'bg-white'} hover:bg-[#F4F4F4] hover:cursor-pointer`
            }
            onClick={async () => {
                if (data.tipo === "PUBLICACAO_NOVA") {
                    navigate(`/publicacao/${data.publicacao_id}`)
                };
                if (!data.lida) {data.lida = true; await marcarComoLida(data.id)};
                onClick()
            }}
        >
            <div className="size-[40px] bg-[#D9D9D9] rounded-[50%]" />
            <div className="flex justify-between flex-1">
                {data.tipo === "PUBLICACAO_NOVA" &&
                <div className="flex items-center w-[420px]">
                    <span className="text-[16px] text-[#3C4043] font-semibold line-clamp-2">
                        Nova publicação, venha ver! {data.titulo_publicacao}
                    </span>
                </div>
                }
                <div className="flex flex-col flex-1 justify-between items-end h-[50px]">
                    <button onClick={(e) => {e.stopPropagation()}}> <Trash className="size-[16px] stroke-[#8D8D8D]" /> </button>
                    <span className="text-[14px] text-[#8D8D8D] font-semibold inline-block"> 
                        {(timestampDiff < 60) ? `${timestampDiff} min` : 
                         (timestampDiff/60 < 24) ? `${Math.round(timestampDiff/60)} h`:
                         `${Math.round(timestampDiff/(60 * 24))} d`}
                    </span>
                </div>
            </div>
        </div>
    )
}