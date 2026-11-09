import { useState } from "react";
import { Megaphone, Check, CircleAlert } from "lucide-react";
import closeIcon from "../../assets/icons/close.svg";
import Button from "../Button";
import { criarDenuncia } from "../../services/criarDenuncia";

const MOTIVOS = [
    "Conteúdo inadequado ou ofensivo",
    "Spam ou publicação repetida",
    "Informação falsa ou enganosa",
    "Assédio ou desrespeito",
    "Outro motivo",
];

export default function DenunciarPubModal({ pubId, onClickX }) {
    const [motivo, setMotivo] = useState("");
    const [descricao, setDescricao] = useState("");
    const [tentouEnviar, setTentouEnviar] = useState(false);
    const [enviando, setEnviando] = useState(false);
    const [enviada, setEnviada] = useState(false);
    const [erroApi, setErroApi] = useState("");

    const erroMotivo = tentouEnviar && !motivo;

    async function handleEnviar() {
        setTentouEnviar(true);
        if (!motivo || enviando) return;

        setEnviando(true);
        setErroApi("");
        try {
            await criarDenuncia({ publicacao_id: pubId, motivo, descricao });
            setEnviada(true);
        } catch (error) {
            setErroApi(
                error.response?.status === 409
                    ? "Você já denunciou esta publicação."
                    : "Não foi possível enviar a denúncia. Tente novamente."
            );
        } finally {
            setEnviando(false);
        }
    }

    const cabecalho = (icone, titulo) => (
        <>
            <div className="flex justify-end">
                <button onClick={onClickX} aria-label="Fechar"> <img src={closeIcon} alt="" /> </button>
            </div>
            <div className="flex flex-col items-center gap-[32px] mt-[12px]">
                <div className="flex items-center justify-center bg-[#d9d9d9] size-[80px] rounded-full">
                    {icone}
                </div>
                <h2 className="font-semibold text-[28px] leading-[1.5] text-center text-[#3c4043]">{titulo}</h2>
            </div>
        </>
    );

    if (enviada) return (
        <div className="w-[564px] h-[800px] max-h-[95vh] flex flex-col bg-white rounded-[16px] p-[32px] font-poppins">
            {cabecalho(<Check className="size-[48px] text-[#3c4043]" strokeWidth={2} aria-hidden="true" />, "Agradecemos o feedback!")}
            <p className="text-[16px] leading-[1.5] text-center text-[#3c4043] mt-[14px]">
                Sua denúncia ajuda a manter o Mural SMD <br />seguro para todos e todas!
            </p>
            <div className="bg-[#f9f9f9] rounded-[8px] p-[24px] flex flex-col gap-[14px] mt-[32px] text-[16px] text-[#3c4043]">
                <span className="font-medium leading-none">O que vem a seguir?</span>
                <p className="leading-[1.5]">
                    O moderador irá analisar a publicação e as justificativas da denúncia. Caso seja identificada uma violação, a publicação será removida do mural.
                </p>
            </div>
            <Button variant="cta" onClick={onClickX} className="!w-full !h-[45px] mt-auto"> Entendi </Button>
        </div>
    );

    return (
        <div className="w-[564px] max-h-[95vh] overflow-y-auto bg-white rounded-[16px] p-[32px] font-poppins">
            {cabecalho(<Megaphone className="size-[48px] stroke-[#8d8d8d]" />, <>Você quer denunciar <br />esta publicação?</>)}

            <fieldset className="mt-[32px] flex flex-col gap-[12px]">
                <legend className="font-medium text-[14px] text-black mb-[12px]">
                    Selecione o motivo que melhor descreve o problema *
                </legend>
                {MOTIVOS.map((m) => (
                    <label key={m} className="flex items-center gap-[8px] text-[14px] text-black cursor-pointer w-fit">
                        <input type="radio" name="motivo" value={m} checked={motivo === m}
                            onChange={() => setMotivo(m)} className="sr-only peer" />
                        <span className={`size-[22px] rounded-full border flex items-center justify-center peer-focus-visible:ring-2 peer-focus-visible:ring-[#3c4043]/40 ${erroMotivo ? 'border-[#ea4335]' : motivo === m ? 'border-[#3c4043]' : 'border-[#c4c4c4]'}`}>
                            {motivo === m && <span className="size-[12px] rounded-full bg-[#3c4043]" />}
                        </span>
                        {m}
                    </label>
                ))}
                {erroMotivo && (
                    <div className="flex gap-[8px] items-center" role="alert">
                        <CircleAlert className="size-[14px] stroke-[#ea4335]" />
                        <p className="text-[12px] leading-none text-[#ea4335]">Selecione algum motivo</p>
                    </div>
                )}
            </fieldset>

            <hr className="border-[#e5e5e5] my-[24px]" />

            <p className="font-medium text-[16px] text-[#3c4043]">
                Informações adicionais <span className="text-[#909090]">(opcionais)</span>
            </p>
            <label className="flex flex-col gap-[12px] mt-[24px]">
                <span className="font-medium text-[14px] leading-none text-black">Descreva o motivo</span>
                <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)}
                    placeholder="Explique o motivo..." maxLength={500}
                    className="h-[90px] resize-none border border-[#e5e5e5] rounded-[8px] p-[16px] text-[14px] text-[#303030] placeholder:text-[#909090] outline-none focus:border-[#3c4043]" />
            </label>

            {erroApi && <p role="alert" className="text-[12px] text-[#ea4335] mt-[16px]">{erroApi}</p>}

            <div className="flex justify-between items-center mt-[32px]">
                <Button onClick={onClickX}> Cancelar </Button>
                <Button variant="cta" onClick={handleEnviar} disabled={enviando}
                    className={!motivo && !enviando ? "!bg-[#9d9fa1]" : ""}>
                    {enviando ? "Enviando..." : "Enviar denúncia"}
                </Button>
            </div>
        </div>
    );
}
