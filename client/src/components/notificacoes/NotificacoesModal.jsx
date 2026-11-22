import { CheckCheck, X } from "lucide-react";
import { getNotificacoes } from "../../services/notificacoes/obterNotificacoes";
import { useRef, useState } from "react";
import { useEffect } from "react";
import { isSameDay, isSameMonth, isSameWeek } from "date-fns";
import error404 from "../../assets/illustrations/404 error.png"
import NotificacaoBlock from "./NotificacaoBlock";
import Button from "../Button";
import { excluirNotificacao } from "../../services/notificacoes/excluirNotificacao";
import { marcarTodasComoLidas } from "../../services/notificacoes/marcarTodasComoLidas";
import closeModal from "../../utils/closeModal";

export default function NotificacoesModal({ onClose }) {
    const [notificacoes, setNotificacoes] = useState([])
    const modalRef = useRef(null);

    useEffect(() => {
        getNotificacoes().then(setNotificacoes).catch(e => console.error("Erro ao buscar as notificações:", e))
    }, []);

    const [pendentesExclusao, setPendentesExclusao] = useState([]);

    const alternarPendente = (id) => setPendentesExclusao((prev) => prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]);

    closeModal(modalRef, onClose)

    async function closeModalandExclude() {
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

        return [{ titulo: "Hoje", array: notificacoesHoje },
        { titulo: "Última semana", array: notificacoesSemana },
        { titulo: "Este mês", array: notificacoesMes }]
    }

    const [tabAtual, setTabAtual] = useState("Todas")

    return (
        <div ref={modalRef} tabIndex={-1} aria-label="Notificações" className="relative h-full w-[588px] flex flex-col rounded-tl-[12px] bg-white z-10">
            <div className="border border-x-0 border-t-0 border-b-[#e5e5e5]">
                <div className="flex justify-between items-center p-[32px]">
                    <span className="text-[24px] font-semibold font-bricolage text-[#3C4043]"> Notificações </span>
                    <button onClick={closeModalandExclude} aria-label='Fechar modal de notificações'>
                        <X className="size-[24px] stroke-[#3C4043]" />
                    </button>
                </div>
                {/* Abas: o leitor de tela anuncia "aba, selecionada, 1 de 3". Setas trocam de aba. */}
                <div role="tablist" aria-label="Filtrar notificações" className="flex gap-[12px] w-full justify-between px-[12px]"
                    onKeyDown={(e) => {
                        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
                        const abas = ["Todas", "Lidas", "Não Lidas"];
                        const proxima = abas[(abas.indexOf(tabAtual) + (e.key === "ArrowRight" ? 1 : 2)) % 3];
                        setTabAtual(proxima);
                        e.currentTarget.querySelector(`[data-aba="${proxima}"]`)?.focus();
                    }}>
                    {[["Todas", notificacoes.length], ["Lidas", notificacoesLidas.length], ["Não Lidas", notificacoesNaoLidas.length]].map(([aba, qtd]) => (
                        <button
                            key={aba}
                            role="tab"
                            data-aba={aba}
                            id={`aba-notificacoes-${aba}`}
                            aria-selected={tabAtual === aba}
                            aria-controls="painel-notificacoes"
                            tabIndex={tabAtual === aba ? 0 : -1}
                            className={`w-1/3 py-[8px] ${tabAtual === aba && 'border-b-4 border-b-black'} transition-all`}
                            onClick={() => setTabAtual(aba)}
                        >
                            <span> {aba} </span> <span className="font-semibold text-[#6b6b6b]"> {qtd} </span>
                        </button>
                    ))}
                </div>
            </div>

            <div id="painel-notificacoes" role="tabpanel" aria-labelledby={`aba-notificacoes-${tabAtual}`} className="py-[32px] flex flex-col gap-[32px] h-[80%] overflow-y-auto scrollbar-none">
                {secoes(tabAtual)[0].array.length > 0 || secoes(tabAtual)[1].array.length > 0 || secoes(tabAtual)[2].array.length > 0 ?
                    secoes(tabAtual).map((s, i) =>
                        (s.array.length > 0) &&
                        <div key={i} className="flex flex-col gap-[12px]">
                            <span className="ml-[28px] text-[20px] text-[#3C4043] font-semibold"> {s.titulo} </span>
                            <div className="flex flex-col gap-[4px]">
                                {s.array.map((n) =>
                                    <NotificacaoBlock
                                        key={n.id}
                                        data={n}
                                        excluida={pendentesExclusao.includes(n.id)}
                                        onAlternar={alternarPendente}
                                        onAbrir={closeModalandExclude} />
                                )}
                            </div>
                        </div>
                    )
                    :
                    (<div className="w-full h-full flex flex-col justify-center items-center gap-[12px]">
                        <img src={error404}/>
                        <span className="font-medium text-[24px] text-[#909090] w-[50%] text-center"> Nenhuma notificação encontrada </span>
                    </div>)
                }
            </div>

            <div className="flex justify-center items-center flex-1 p-[32px] border border-x-0 border-b-0 border-t-[#e5e5e5]">
                <Button
                    variant="cta"
                    className="w-full"
                    onClick={async () => {
                        await marcarTodasComoLidas();
                        setNotificacoes(prev => prev.map((n) => ({ ...n, lida: true })))
                    }}
                >
                    <CheckCheck className="size-[20px]" />
                    <span> Marcar todas como lidas </span>
                </Button>
            </div>
        </div>
    )
}