import { useEffect, useState } from "react";
import Button from "../Button";
import { CircleCheck, Copy } from "lucide-react";

export default function CopiarLinkBtn({ onClick }) {
    const [btnClicado, setBtnClicado] = useState(false);

    useEffect(() => {
        if (!btnClicado) return;

        setTimeout(() => {
            setBtnClicado(false)
        }, 5000)
    }, [btnClicado])

    return (
        <Button onClick={() => {
            onClick();
            setBtnClicado(true);
        }} variant="text" aria-live="polite">
            <div className="relative">
                <div className={`flex justify-center gap-[12px] ${btnClicado? 'opacity-100':'opacity-0'}`} aria-hidden={!btnClicado}>
                    <CircleCheck className="size-[18px]" />
                    <span> Link Copiado! </span>
                    
                </div>

                <div className={`absolute top-0 left-2 flex justify-center gap-[12px] ${btnClicado? 'opacity-0':'opacity-100'}`} aria-hidden={btnClicado}>
                    <Copy className="size-[18px]" />
                    <span> Copiar Link </span>
                </div>

            </div>
        </Button>
    )
}