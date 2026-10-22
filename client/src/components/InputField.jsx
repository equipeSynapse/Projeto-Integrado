import { useState } from 'react'
import eyeClosedIcon from '../assets/icons/eye-closed.svg'
import eyeIcon from '../assets/icons/eye.svg'
import infoIcon from '../assets/icons/info.svg'

export function InputField({
  onBlur,
  label,
  inputId,
  inputType,
  inputValue,
  inputOnChange,
  inputPlaceholder,
  errorVar,
  children
}) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const isPassword = inputType === "password"
  const actualInputType = isPassword ? (isPasswordVisible ? "text" : "password") : inputType

  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      {label && (
        <label htmlFor={inputId} className="font-poppins font-medium leading-none relative shrink-0 text-[14px] text-black w-full">
          {label}
        </label>
      )}

      <div className="w-full relative flex items-center">
        <input
          onBlur={onBlur}
          id={inputId}
          type={actualInputType}
          value={inputValue}
          onChange={inputOnChange}
          placeholder={inputPlaceholder}
          className={`bg-white border ${
            errorVar ? 'border-[#d93025]' : 'border-[#e5e5e5] focus:border-[#8d8d8d]'
          } border-solid font-poppins font-normal h-[48px] leading-none outline-none px-[16px] ${
            isPassword ? 'pr-[48px]' : 'pr-[16px]'
          } py-[10px] rounded-[8px] text-[#1f1f1f] text-[14px] w-full placeholder:text-[#909090]`}
        />

        {/* Renderiza o botão interno apenas se for password e NÃO houver children customizado */}
        {isPassword && !children && (
          <button
            type="button"
            onClick={() => setIsPasswordVisible((prev) => !prev)}
            className="absolute right-[16px] flex items-center justify-center cursor-pointer select-none"
            aria-label={isPasswordVisible ? "Ocultar senha" : "Mostrar senha"}
          >
            <img
              alt={isPasswordVisible ? "Ocultar senha" : "Mostrar senha"}
              src={isPasswordVisible ? eyeIcon : eyeClosedIcon}
              className="size-[16px] md:size-[20px]"
            />
          </button>
        )}

        {/* Permite elementos filhos extras apenas quando necessário */}
        {children}
      </div>

      {errorVar && (
        <div className="flex flex-row gap-[8px] items-center">
          <img src={infoIcon} alt="Erro" className="size-[14px]" />
          <p className="font-poppins font-normal text-[12px] text-[#d93025]">{errorVar}</p>
        </div>
      )}
    </div>
  )
}