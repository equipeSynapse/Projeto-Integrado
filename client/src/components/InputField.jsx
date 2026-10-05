import { useState } from 'react'
import eyeClosedIcon from '../assets/icons/eye-closed.svg'
import eyeIcon from '../assets/icons/eye.svg'

export function InputField({ label, inputId, inputType, inputValue, inputOnChange, inputPlaceholder, errorVar }) {

  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const actualInputType = inputType === "password" ? isPasswordVisible ? "text" : "password" : inputType

  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <label htmlFor="nomeUsuario" className="font-poppins font-medium leading-none relative shrink-0 text-[14px] text-black w-full">
        {label}
      </label>
      <div className='w-full flex items-center'>
        <input
          id={inputId}
          type={actualInputType}
          value={inputValue}
          onChange={inputOnChange}
          placeholder={inputPlaceholder}
          className={`bg-white border ${errorVar ? 'border-[#d93025]' : 'border-[#e5e5e5]'} border-solid font-poppins font-normal h-[48px] leading-none outline-none px-[16px] py-[10px] relative rounded-[8px] shrink-0 text-[#1f1f1f] text-[14px] w-full placeholder:text-[#909090]`}
        />
        {inputType === "password" ? <button type="button" onClick={() => setIsPasswordVisible(!isPasswordVisible)} className='absolute right-[28px] size-[16px] md:size-[20px]'> <img src={isPasswordVisible ? eyeIcon : eyeClosedIcon} /> </button> : ""}
      </div>
      {errorVar && (
        <p className="font-poppins font-normal text-[12px] text-[#d93025]">{errorVar}</p>
      )}
    </div>
  )
}