import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react"
import closeModal from "../../utils/closeModal";
import { getMinhasDenuncias } from "../../services/denuncias/obterMinhasDenuncias";
import DenunciaBlock from "./DenunciaBlock";
import { excluirDenuncia } from "../../services/denuncias/excluirDenuncia";
import error404 from "../../assets/illustrations/404 error.png"

export default function MinhasDenuncias({ onClose }) {
    const [tabAtual, setTabAtual] = useState("Em análise");
    const [denuncias, setDenuncias] = useState([])
    const [pendentesExclusao, setPendentesExclusao] = useState([]);

    const alternarPendente = (id) => setPendentesExclusao((prev) => prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]);

    const denunciasAnalise = denuncias.filter(d => d.status === "PENDENTE");
    const denunciasConcluidas = denuncias.filter(d => ["APROVADA", "REJEITADA"].includes(d.status));

    const modalRef = useRef(null);

    useEffect(() => {
        getMinhasDenuncias().then(setDenuncias).catch((e) => console.error("Erro ao buscar denúncias do usuário."))
    }, [])

    closeModal(modalRef, closeModalandExclude)

    async function closeModalandExclude() {
        if (pendentesExclusao.length > 0) {
            try {
                await Promise.all(pendentesExclusao.map((id) => excluirDenuncia(id)))
            } catch (error) {
                console.error(error);
            }
        }

        onClose()
    }

    return (
        <div ref={modalRef} tabIndex={-1} className="relative h-full w-[588px] flex flex-col rounded-tl-[12px] bg-white">
            
                <div className="flex justify-between items-center p-[32px]">
                    <span className="text-[20px] font-semibold text-[#3C4043]"> Minhas Denúncias </span>
                    <button onClick={closeModalandExclude} aria-label='Fechar modal de denúncias'>
                        <X className="size-[24px] stroke-[#3C4043]" />
                    </button>
                </div>

                <div role="tablist" aria-label="Filtrar Denúncias" className="flex gap-[12px] w-full justify-between px-[12px]"
                    onKeyDown={(e) => {
                        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
                        const abas = ["Em análise", "Concluídas"];
                        const proxima = abas[(abas.indexOf(tabAtual) + (e.key === "ArrowRight" ? 1 : 1)) % 2];
                        setTabAtual(proxima);
                        e.currentTarget.querySelector(`[data-aba="${proxima}"]`)?.focus();
                    }}>
                    {["Em análise", "Concluídas"].map((aba) => (
                        <button
                            key={aba}
                            role="tab"
                            data-aba={aba}
                            id={`aba-minhas-denuncias-${aba}`}
                            aria-selected={tabAtual === aba}
                            aria-controls="painel-minhas-denuncias"
                            tabIndex={tabAtual === aba ? 0 : -1}
                            className={`w-1/2 py-[8px] font-medium ${tabAtual === aba ? 'border-b-4 border-b-principal text-principal' : 'text-[#6b6b6b]'} transition-all`}
                            onClick={() => setTabAtual(aba)}
                        >
                            <span> {aba} </span>
                        </button>
                    ))}

                </div>

                <div id="painel-minhas-denuncias" role="tabpanel" aria-labelledby={`aba-minhas-denuncias-${tabAtual}`} className="h-full py-[32px] flex flex-col gap-[16px] overflow-y-auto scrollbar-none">
                    {
                        tabAtual === "Em análise" ?
                            denunciasAnalise.length > 0 ?
                                denunciasAnalise.map(d => (
                                    <DenunciaBlock
                                        key={d.id}
                                        data={d}
                                        excluida={pendentesExclusao.includes(d.id)}
                                        onAlternar={alternarPendente}
                                    />
                                ))
                                :
                                <div className="w-full h-full flex flex-col justify-center items-center gap-[12px]">
                                    <img src={error404}/>
                                    <span className="font-medium text-[24px] text-[#909090] w-[50%] text-center"> Nenhuma denúncia encontrada </span>
                                </div>

                            :
                            denunciasConcluidas.length > 0 ?
                                denunciasConcluidas.map(d => (
                                    <DenunciaBlock
                                        key={d.id}
                                        data={d}
                                        excluida={pendentesExclusao.includes(d.id)}
                                        onAlternar={alternarPendente}
                                    />
                                ))
                                :
                                <div className="w-full h-full flex flex-col justify-center items-center gap-[12px]">
                                    <img src={error404}/>
                                    <span className="font-medium text-[24px] text-[#909090] w-[50%] text-center"> Nenhuma denúncia encontrada </span>
                                </div>

                    }
                </div>

        </div>
    )
}