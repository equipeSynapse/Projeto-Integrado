import { useEffect, useLayoutEffect, useRef, useState } from "react"

export default function Toast({titulo, mensagem, onClose}){
    const onCloseRef = useRef(onClose)
    useLayoutEffect(() => { onCloseRef.current = onClose })

    // O texto entra um instante depois da região "status" existir na página: leitores de tela
    // só anunciam mudanças dentro de uma região viva que já estava lá.
    const [visivel, setVisivel] = useState(false)

    useEffect(() => {
        const mostrar = setTimeout(() => setVisivel(true), 100)
        const fechar = setTimeout(() => onCloseRef.current(), 5000)
        return () => { clearTimeout(mostrar); clearTimeout(fechar) }
    }, [])

    return (
        <>
        <div role="status" aria-live="polite" aria-atomic="true" className="bg-white z-20 fixed top-20 right-20 flex flex-col w-[400px] h-[106px] font-poppins rounded-[8px] overflow-hidden animate-[slideIn_0.3s_ease-out]">
            <div className="flex flex-col gap-[6px] justify-center h-[100px] bg-white py-[28px] px-[24px]">
                <span className="text-[16px] font-semibold"> {visivel && `${titulo} `}</span>
                <span className=""> {visivel && mensagem} </span>
            </div>

            <div className="bg-[#C9E5D1]" aria-hidden="true">
               <div className="bg-sucesso h-[6px] animate-[toastTimeOut_5.2s]"/>
            </div>
        </div>

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
        </>
    )
}
