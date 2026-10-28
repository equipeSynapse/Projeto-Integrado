import { useEffect } from "react"

export default function Toast({titulo, mensagem, onClose}){
    useEffect(() => {
        setTimeout(() => onClose(), 4000)
    }, [onClose])

    return (
        <div className="z-20 fixed top-20 right-20 flex flex-col w-[400px] h-[106px] font-poppins rounded-[8px] overflow-hidden animate-[slideIn_0.3s_ease-out]">
            <div className="flex flex-col gap-[6px] justify-center h-[100px] bg-white py-[28px] px-[24px]">
                <span className="text-[16px] font-semibold"> {titulo} </span>
                <span className=""> {mensagem} </span>
            </div>

            <div className="bg-black h-[6px] animate-[toastTimeOut_5.2s]"/>

            <style>{`
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                    } to {
                        transform: translateX(0);
                    }
                } 

                @keyframes toastTimeOut {
                    from {
                        width: 100%
                    } to {
                        width: 0 
                    }
                }
            `}</style>
        </div>
    )
}