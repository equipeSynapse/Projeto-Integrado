import { useState } from "react"

export default function CategoriaCard({ texto, onClick }){
    const [clicado, setClicado] = useState(false);

    return (
        <button 
            onClick={() => {setClicado(!clicado), onClick()}} 
            className={`relative h-[100px] max-w-[250px] px-[24px] py-[12px] text-left border ${clicado? 'border-[#8d8d8d]':'border-[#e5e5e5]'}
            rounded-[12px] overflow-hidden hover:cursor-pointer transition-all duration-300`}
        >
            <span className="font-poppins font-medium block max-w-[130px]"> {texto} </span>
            <div className="absolute bg-[#e5e5e5] size-[100px] right-[-40px] bottom-[-50px] rounded-[50px]"/>
        </button>
    )
}