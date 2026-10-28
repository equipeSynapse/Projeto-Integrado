import { useRef, useState } from "react"
import Campo from "./Campo"
import { CloudUpload, X } from "lucide-react"

export default function Dropzone({ formatos, aceitos, arquivo, onArquivo }) {
    const MAX_FILE_SIZE = 5 * 1024 * 1024
    
    const inputRef = useRef(null)
    const [erro, setErro] = useState('')

    function receber(file) {
        if (!file) return
        if (!aceitos.includes(file.type)) return setErro(`Formato inválido. Aceitos: ${formatos}`)
        if (file.size > MAX_FILE_SIZE) return setErro('O arquivo deve ter até 5mb')
        setErro('')
        onArquivo(file)
    }

    return (
        <Campo erro={erro}>
            <div
                onClick={() => inputRef.current.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); receber(e.dataTransfer.files[0]) }}
                className="bg-white border border-dashed border-[#e5e5e5] flex flex-col gap-[20px] h-[192px] items-center justify-center p-[24px] rounded-[8px] w-full cursor-pointer"
            >
                <input ref={inputRef} type="file" accept={aceitos.join(',')} className="hidden" onChange={(e) => { receber(e.target.files[0]); e.target.value = '' }} />
                <div className="size-[48px] rounded-full bg-[#f2f2f2] flex items-center justify-center">
                    <CloudUpload className="size-[20px] text-[#3c4043]" />
                </div>
                {arquivo ? (
                    <div className="flex items-center gap-[8px] font-poppins text-[14px] text-[#3c4043]">
                        <span className="truncate max-w-[400px]">{arquivo.name}</span>
                        <button type="button" onClick={(e) => { e.stopPropagation(); onArquivo(null) }}>
                            <X className="size-[16px]" />
                        </button>
                    </div>
                ) : (
                    <p className="font-poppins text-[14px] text-center text-[#3c4043] w-[208px] leading-[1.5]">
                        <span className="font-medium">Arraste e solte</span> ou <span className="font-medium">clique</span> para escolher o arquivo
                    </p>
                )}
                <p className="font-poppins text-[12px] leading-none text-[#909090]">Formatos aceitos: {formatos} até 5mb</p>
            </div>
        </Campo>
    )
}