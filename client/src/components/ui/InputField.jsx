import { useState } from 'react'
import eyeClosedIcon from '../../assets/icons/eye-closed.svg'
import eyeIcon from '../../assets/icons/eye.svg'

export function InputField({label, typeInput, value, onChange, borderInputColor = "border-[#e5e5e5]", placeholder}) {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)
    const actualType = typeInput === "password"? isPasswordVisible? "text":"password" : typeInput

    return (
        <div className="flex flex-col gap-1">
            <label className="text-[12px] md:text-[14px] font-medium"> {label} </label>
            <div className='flex items-center'>
                <input type={actualType} value={value} onChange={onChange}
                   className={`relative text-[12px] w-full bg-white md:text-[14px] h-[48px] ${borderInputColor} px-[8px] md:px-[16px] py-[14px] md:py-[20px] md:h-[48px] border rounded-sm`}
                   placeholder={placeholder} />

                   {typeInput === "password" ? <button type="button" onClick={() => setIsPasswordVisible(!isPasswordVisible)} className='absolute right-[54px] size-[16px] md:size-[20px]'> <img src={isPasswordVisible? eyeIcon : eyeClosedIcon}/> </button>:""}
            </div>
        </div>
    )
}

