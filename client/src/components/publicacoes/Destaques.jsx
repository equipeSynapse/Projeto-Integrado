import { ChevronRight } from "lucide-react";
import timestampMsg from "../../utils/timestampMsg";
import { useNavigate } from "react-router-dom";

export default function Destaques({ dataPosts }) {
    const navigate = useNavigate();

    const destaques = dataPosts.filter(
        (p) => (p.autor_email === "smd@virtual.ufc.br")
    )

    return (
        <div className="bg-white flex flex-col gap-[12px] border w-[290px] pb-[24px] rounded-[12px] border-[#e5e5e5]">
            <div className="px-[36px] pt-[36px] py-[12px]">
                <span className="font-semibold font-bricolage text-[18px]"> Últimos destaques </span>
                <span> Avisos Administrativos da Secretaria SMD. </span>
            </div>

            <div className="flex flex-col">
                {destaques.slice(0, 3).map((d) => (
                    <div className="flex flex-col px-[36px] hover:bg-[#F4F4F4]">
                        <button
                            key={d.id}
                            onClick={() => navigate(`/publicacao/${d.id}`)}
                            className="border border-x-0 border-b-0 border-t-[#e5e5e5] py-[16px] hover:cursor-pointer"
                        >
                            <div className="flex gap-[14px] text-[14px]">
                                <div className="bg-destaque aspect-square font-medium flex items-center justify-center size-[40px] [mask-image:url(assets/Molde.svg)] [mask-size:contain]"> SS </div>
                                <div className="flex flex-col items-start w-[150px]">
                                    <span className="font-medium"> Secretaria SMD </span>
                                    <span className="text-[#6B6B6B] text-[12px]"> Publicado {timestampMsg(new Date(), new Date(d.criado_em), true)}</span>
                                </div>
                                <ChevronRight className="stroke-[#6B6B6B] size-[20px]" />
                            </div>
                            <span className="text-[14px] line-clamp-2 mt-[16px] text-left"> {d.descricao} </span>
                        </button>
                    </div>
                ))}
            </div>

        </div>
    )
}