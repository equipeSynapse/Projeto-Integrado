export default function Button( {variant, children} ) {
    const variantStyles = {
        cta: 'px-[24px] py-[12px] bg-[#3c4043] flex justify-center items-center gap-[12px] rounded-[50px] w-[134px] font-medium text-white hover:bg-[#363A3E] hover:cursor-pointer',
        text: 'px-[24px] py-[12px] flex justify-center items-center gap-[12px] rounded-[50px] font-medium hover:bg-[rgba(60,64,67,0.1)] hover:cursor-pointer',
        second: 'px-[24px] py-[12px] border-1 border-[#e5e5e5] flex justify-center items-center gap-[12px] rounded-[50px] font-medium hover:bg-[rgba(60,64,67,0.1)] hover:cursor-pointer'
    }

    return(
        <button className={`${variantStyles[variant]}`}>
            {children}
        </button>
    )
}