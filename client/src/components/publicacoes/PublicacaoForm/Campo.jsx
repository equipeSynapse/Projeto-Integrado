import InfoIcon from "../../../assets/icons/info.svg"

export default function Campo({ label, erro, children, className = '' }) {
    return (
        <div className={`flex flex-col gap-[12px] items-start w-full ${className}`}>
            {label && <span className="font-poppins font-medium leading-none text-[14px] text-[#3c4043] w-full">{label}</span>}
            {children}
            {erro && (
                <div className="flex gap-[8px] items-center">
                    <img src={InfoIcon} className="size-[14px]" />
                    <p className="font-poppins text-[12px] leading-none text-[#ea4335]">{erro}</p>
                </div>
            )}
        </div>
    )
}