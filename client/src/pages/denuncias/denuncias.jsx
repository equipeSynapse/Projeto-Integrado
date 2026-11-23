import { useEffect, useState } from "react"
import useHeader from "../../components/Header"
import { getDenuncias } from "../../services/denuncias/obterDenuncias";

export default function DenunciasPage() {
    const { Header } = useHeader({})

    const [denuncias, setDenuncias] = useState([])
    const [denunciaSelecionada, setDenunciaSelecionada] = useState(null);

    const statusMap = {
        PENDENTE: {status: "Pendente de análise", color: "#3C4043", bgColor: "#f0f0f0"},
        APROVADA: {status: "Denúncia acolhida", color: "#0DA83B", bgColor: "#ECF8F0"},
        REJEITADA: {status: "Denúncia rejeitada", color: "#EA4335", bgColor: "#FEF0EF"}
    }

    useEffect(() => {
        getDenuncias().then(setDenuncias).catch(e => console.error("Erro ao buscar denúncias:", e))
    }, [])

    return (
        <div className="min-h-screen bg-[#F7F4EF]">
            {Header}
            <main id="conteudo" tabIndex={-1} className="flex justify-center gap-[48px] px-[24px] pt-[130px] pb-[48px] mx-auto items-start outline-none">
                <div className="w-[564px] bg-white rounded-[12px] border-1 border-[#e5e5e5]">
                    <div className="p-[24px] border-b-1 border-[#e5e5e5]">
                        <h2 className="font-bricolage font-semibold text-[24px]"> Publicações denunciadas </h2>
                        <span className="font-poppins text-[#909090] mt-[12px]"> As denúncias são agrupadas por publicação. </span>
                    </div>

                    <div className="p-[24px] flex flex-col gap-[24px]">
                        {denuncias.map((d) =>
                            <button className="px-[24px] py-[16px] flex justify-start border-1 border-[#e5e5e5] rounded-[8px]"> 
                                <div className="flex justify-between w-full gap-[4px]">
                                    <div className="flex text-left">
                                        <h3 className="font-poppins font-medium text-[16px]"> {d.titulo_publicacao} </h3>
                                    </div>
                                    <span  
                                        className="font-poppins font-medium text-[12px] h-[24px] px-[12px] py-[6px] flex justify-center items-center rounded-full whitespace-nowrap" 
                                        style={{color: statusMap[d.status].color, backgroundColor: statusMap[d.status].bgColor}}
                                    > 
                                        {statusMap[d.status].status} 
                                    </span>
                                </div>
                            </button>
                        )}
                    </div>
                </div>

                <div className="w-[824px] bg-white">
                    AAAA
                </div>
            </main>
        </div>
    )
}