export default function Button( {variant, children, className, onClick, type, disabled} ) {
    const variantStyles = {
        cta: 'px-[24px] py-[12px] bg-[#3c4043] flex justify-center items-center text-[14px] gap-[12px] rounded-[50px] w-fit font-medium font-poppins text-white hover:bg-[#363A3E] hover:cursor-pointer',
        text: 'px-[24px] py-[12px] flex justify-center items-center gap-[12px] text-[14px] rounded-[50px] w-fit font-medium font-poppins hover:bg-[rgba(60,64,67,0.06)] hover:cursor-pointer',
        second: 'px-[24px] py-[12px] border-1 border-[#e5e5e5] flex justify-center items-center gap-[12px] text-[14px] w-fit rounded-[50px] font-medium font-poppins hover:bg-[rgba(60,64,67,0.06)] hover:cursor-pointer'
    }

    return(
        <button type={type} disabled={disabled} onClick={onClick} className={`${variant? variantStyles[variant]:variantStyles['text']} ${className || ''}`}>
            {children}
        </button>
    )
}