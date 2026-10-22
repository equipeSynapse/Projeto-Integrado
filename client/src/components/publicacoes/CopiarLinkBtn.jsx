import { useEffect, useState } from "react";
import Button from "../Button";
import circleCheckIcon from "../../assets/icons/circle-check.svg"

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
        }} variant="text">
            <div className="relative">
                <div className={`flex justify-center gap-[12px] ${btnClicado? 'opacity-100':'opacity-0'}`}>
                    <img src={circleCheckIcon} className="size-[18px]" />
                    <span> Link Copiado! </span>
                </div>

                <div className={`absolute top-0 left-2 flex justify-center gap-[12px] ${btnClicado? 'opacity-0':'opacity-100'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3C4043" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
                    <span> Copiar Link </span>
                </div>

            </div>
        </Button>
    )
}