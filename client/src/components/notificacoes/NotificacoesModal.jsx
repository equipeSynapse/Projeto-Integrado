import { CheckCheck, X } from "lucide-react";
import { getNotificacoes } from "../../services/notificacoes/obterNotificacoes";
import { useRef, useState } from "react";
import { useEffect } from "react";
import { isSameDay, isSameMonth, isSameWeek } from "date-fns";
import NotificacaoBlock from "./NotificacaoBlock";
import Button from "../Button";
import { excluirNotificacao } from "../../services/notificacoes/excluirNotificacao";
import { marcarTodasComoLidas } from "../../services/notificacoes/marcarTodasComoLidas";

export default function NotificacoesModal({ onClose }) {
    const [notificacoes, setNotificacoes] = useState([])
    const modalRef = useRef(null);

    useEffect(() => {
        if (modalRef.current) {
            modalRef.current.focus();
        }

        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);
    
    useEffect(() => {
        getNotificacoes().then(setNotificacoes).catch(e => console.error("Erro ao buscar as notificações:", e))
    }, []);

    const [pendentesExclusao, setPendentesExclusao] = useState([]);

    const alternarPendente = (id) => setPendentesExclusao((prev) => prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]);

    async function closeModal() {
        onClose()
        if (pendentesExclusao.length > 0) {
            try {
                await Promise.all(pendentesExclusao.map((id) => excluirNotificacao(id)))
            } catch (error) {
                console.error(error);
            }
        }
    }

    const notificacoesLidas = notificacoes.filter((n) => n.lida === true);
    const notificacoesNaoLidas = notificacoes.filter((n) => n.lida === false);

    function secoes(tab) {
        let arrayNotif = []
        
        if (tab === "Todas") arrayNotif = notificacoes
        else if (tab === "Lidas") arrayNotif = notificacoesLidas
        else if (tab === "Não Lidas") arrayNotif = notificacoesNaoLidas

        const notificacoesHoje = arrayNotif.filter((n) => isSameDay(n.gerada_em, new Date()))
        const notificacoesSemana = arrayNotif.filter((n) => isSameWeek(n.gerada_em, new Date()) && !notificacoesHoje.some((h) => h.id === n.id))
        const notificacoesMes = arrayNotif.filter((n) => isSameMonth(n.gerada_em, new Date()) &&
        !notificacoesHoje.some((h) => h.id === n.id) &&
        !notificacoesSemana.some((s) => s.id === n.id))

        return [{titulo: "Hoje", array: notificacoesHoje},
                {titulo: "Última semana", array: notificacoesSemana}, 
                {titulo: "Este mês", array: notificacoesMes}]
    }

    const [tabAtual, setTabAtual] = useState("Todas")

    return (
        <div ref={modalRef} tabIndex={-1} className="relative h-full w-[588px] flex flex-col rounded-tl-[12px] bg-white z-10">
            <header className="border border-x-0 border-t-0 border-b-[#e5e5e5]">
                <div className="flex justify-between items-center p-[32px]">
                    <span className="text-[20px] font-semibold text-[#3C4043]"> Notificações </span>
                    <button onClick={closeModal} aria-label='Fechar modal de notificações'> 
                        <X className="size-[24px] stroke-[#3C4043]" /> 
                    </button>
                </div>
                <div className="flex gap-[12px] w-full justify-between px-[12px]">
                    <button className={`w-1/3 py-[8px] ${tabAtual === "Todas" && 'border-b-4 border-b-black'} transition-all`} onClick={() => setTabAtual("Todas")} >
                        <span> Todas </span> <span className="font-semibold text-[#8D8D8D]"> {notificacoes.length} </span>
                    </button>
                    <button className={`w-1/3 py-[8px] ${tabAtual === "Lidas" && 'border-b-4 border-b-black'} transition-all`} onClick={() => setTabAtual("Lidas")} >
                        <span> Lidas </span> <span className="font-semibold text-[#8D8D8D]"> {notificacoesLidas.length} </span>
                    </button>
                    <button className={`w-1/3 py-[8px] ${tabAtual === "Não Lidas" && 'border-b-4 border-b-black'} transition-all`} onClick={() => setTabAtual("Não Lidas")} >
                        <span> Não Lidas </span> <span className="font-semibold text-[#8D8D8D]"> {notificacoesNaoLidas.length}  </span>
                    </button>
                </div>
            </header>

            <div className="py-[32px] flex flex-col gap-[32px] h-[80%] overflow-y-auto scrollbar-none">
                {secoes(tabAtual).map((s, i) =>
                    (s.array.length > 0) && <div key={i} className="flex flex-col gap-[12px]">
                        <span className="ml-[28px] text-[20px] text-[#3C4043] font-semibold"> {s.titulo} </span>
                        <div className="flex flex-col gap-[4px]">
                            {s.array.map((n) =>
                                <NotificacaoBlock 
                                    key={n.id} 
                                    data={n} 
                                    excluida={pendentesExclusao.includes(n.id)} 
                                    onAlternar={alternarPendente}/>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="flex justify-center items-center flex-1 p-[32px] border border-x-0 border-b-0 border-t-[#e5e5e5]">
                <Button 
                    variant="cta" 
                    className="w-full" 
                    onClick={async () => {
                        await marcarTodasComoLidas(); 
                        setNotificacoes(prev => prev.map((n) => ({ ...n, lida:true}))) }}
                >
                    <CheckCheck className="size-[20px]" />
                    <span> Marcar todas como lidas </span>
                </Button>
            </div>
        </div>
    )
}