import { useEffect, useState } from "react"
import InfoIcon from "../../../assets/icons/info.svg"

export default function Campo({ label, erro, htmlFor, children, className = '' }) {

    return (
        <div className={`relative flex flex-col gap-[12px] items-start w-full ${className}`}>
            {label && <label htmlFor={htmlFor} className="font-poppins font-medium leading-none text-[14px] text-[#3c4043] w-full">{label}</label>}
            {children}
            {erro && (
                <div role="alert" aria-atomic="true" className="flex gap-[8px] items-center">
                    <img src={InfoIcon} aria-hidden="true" className="size-[14px]" />
                    <p className="font-poppins text-[12px] leading-none text-[#ea4335]">{erro}</p>
                </div>
            )}
        </div>
    )
}