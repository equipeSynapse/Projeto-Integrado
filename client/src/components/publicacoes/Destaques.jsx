import { ChevronRight } from "lucide-react";
import timestampMsg from "../../utils/timestampMsg";
import { useNavigate } from "react-router-dom";

export default function Destaques( { dataPosts }) {
    const navigate = useNavigate();

    const destaques = dataPosts.filter(
        (p) => (p.autor_email === "smd@virtual.ufc.br")
    )

    return (
        <div className="bg-white flex flex-col gap-[12px] border w-[290px] p-[36px] rounded-[12px] border-[#e5e5e5]">
            <span className="font-semibold"> Últimos destaques </span>
            <span> Avisos Administrativos da Secretaria SMD. </span>
            {destaques.slice(0, 3).map((d) => (
                <div key={d.id} className="border border-x-0 border-b-0 border-t-[#e5e5e5] pt-[16px] pb-[8px]">
                    <div className="flex gap-[14px] text-[14px]">
                        <div className="bg-[#e5e5e5] aspect-square flex items-center justify-center size-[40px] rounded-[50%]"> SS </div>
                        <div className="flex flex-col w-[150px]">
                            <span className="font-medium"> Secretaria SMD </span>
                            <span className="text-[#909090] text-[12px]"> Publicado {timestampMsg(new Date(), new Date(d.criado_em), true)}</span>
                        </div>
                        <button onClick={() => navigate(`/publicacao/${d.id}`)}>
                            <ChevronRight className="stroke-[#909090] size-[20px]" />
                        </button>
                    </div>
                    <span className="text-[14px] line-clamp-2 mt-[16px]"> {d.descricao} </span>
                </div>
            ))}

        </div>
    )
}