import { CheckCheck, X } from "lucide-react";
import { getNotificacoes } from "../../services/notificacoes/obterNotificacoes";
import { useState } from "react";
import { useEffect } from "react";
import { isSameDay, isSameMonth, isSameWeek } from "date-fns";
import NotificacaoBlock from "./NotificacaoBlock";
import Button from "../Button";

export default function NotificacoesModal({ onClickX }) {
    const [notificacoes, setNotificacoes] = useState([])

    useEffect(() => {
        const fetchNotificacoes = async () => {
            try {
                const data = await getNotificacoes();
                setNotificacoes(data);
            } catch (error) {
                console.error("Erro ao buscar publicações:", error);
            }
        };
        fetchNotificacoes();
    }, []);

    const [pendentes, setPendentes] = useState([]);

    async function closeModal() {
        if (pendentes.length > 0) {
            try {

            } catch (error) {
                console.error(error);
            }
        }
    }



    const notificacoesHoje = notificacoes.filter((n) => isSameDay(n.gerada_em, new Date()))
    const notificacoesSemana = notificacoes.filter((n) => isSameWeek(n.gerada_em, new Date()) && !notificacoesHoje.includes(n))
    const notificacoesMes = notificacoes.filter((n) => isSameMonth(n.gerada_em, new Date()) && !notificacoesHoje.includes(n) && !notificacoesSemana.includes(n))

    return (
        <div className="relative h-full w-[588px] flex flex-col rounded-tl-[12px] bg-white">
            <header className="border border-x-0 border-t-0 border-b-[#e5e5e5]" onClick={() => console.log(notificacoes)}>
                <div className="flex justify-between items-center p-[32px]">
                    <span className="text-[20px] font-semibold text-[#3C4043]"> Notificações </span>
                    <button onClick={onClickX}> <X className="size-[24px] stroke-[#3C4043]" /> </button>
                </div>
            </header>

            <div className="py-[32px] flex flex-col gap-[32px] h-[80%] overflow-y-auto scrollbar-none">
                <div className="flex flex-col gap-[12px]">
                    <span className="ml-[28px] text-[20px] text-[#3C4043] font-semibold"> Hoje </span>
                    <div className="flex flex-col gap-[4px]">
                        {notificacoesHoje.map((n) =>
                        <NotificacaoBlock key={n.id} data={n} />
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-[12px]">
                    <span className="ml-[28px] text-[20px] text-[#3C4043] font-semibold"> Última semana </span>
                    <div className="flex flex-col gap-[4px]">
                        {notificacoesSemana.map((n) =>
                            <NotificacaoBlock key={n.id} data={n} />
                        )}
                    </div>
                </div>

                <div>
                    <span className="ml-[28px] text-[20px] text-[#3C4043] font-semibold"> Este mês </span>
                    <div className="flex flex-col gap-[4px]">
                        {notificacoesMes.map((n) =>
                            <NotificacaoBlock key={n.id} data={n} />
                        )}
                    </div>
                </div>

            </div>

            <div className="flex justify-center items-center flex-1 p-[32px] border border-x-0 border-b-0 border-t-[#e5e5e5]"> 
                <Button variant="cta" className="w-full"> 
                    <CheckCheck className="size-[20px]"/>
                    <span> Marcar todas como lidas </span>
                </Button>
            </div>
        </div>
    )
}