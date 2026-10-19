import { useEffect } from "react"

export default function Toast({titulo, mensagem, onClose}){
    useEffect(() => {
        setTimeout(() => onClose(), 3000)
    }, [onClose])
    return (
        <div className="fixed top-40 right-20 w-[464px] h-[106px] font-poppins bg-black rounded-[8px] overflow-hidden animate-[slideIn_0.3s_ease-out]">
            <div className="flex flex-col gap-[6px] justify-center h-[90px] bg-white py-[28px] px-[24px]">
                <span className="text-[16px] font-semibold"> {titulo} </span>
                <span className=""> {mensagem} </span>
            </div>

            <style>{`
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                    } to {
                        transform: translateX(0);
                    }
                } 
            `}</style>
        </div>
    )
}