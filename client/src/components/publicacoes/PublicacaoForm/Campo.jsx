import { useEffect, useState } from "react"
import InfoIcon from "../../../assets/icons/info.svg"

export default function Campo({ label, erro, htmlFor, children, className = '' }) {
    const [anuncio, setAnuncio] = useState('')

    useEffect(() => {
        if (!erro) {
            setAnuncio('')
            return
        }
        const timer = setTimeout(() => {
            setAnuncio(erro)
        }, 150)

        return () => clearTimeout(timer)
    }, [erro])

    return (
        <div className={`flex flex-col gap-[12px] items-start w-full ${className}`}>
            {label && <label htmlFor={htmlFor} className="font-poppins font-medium leading-none text-[14px] text-[#3c4043] w-full">{label}</label>}
            {children}
            {erro && (
                <div className="flex gap-[8px] items-center">
                    <img src={InfoIcon} alt="" className="size-[14px]" />
                    <p className="font-poppins text-[12px] leading-none text-[#ea4335]">{erro}</p>
                </div>
            )}
            <span className="sr-only" aria-live="polite" aria-atomic="true">
                {anuncio}
            </span>
        </div>
    )
}