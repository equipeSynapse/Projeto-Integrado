export default function Radio({ label, checked, onClick, ...props }) {
    return (
        <button role="radio" aria-checked={checked} type="button" onClick={onClick} {...props} className="flex items-center gap-[8px] font-poppins text-[14px] text-[#3c4043] cursor-pointer">
            <span className={`size-[22px] rounded-full border flex items-center justify-center ${checked ? 'border-principal' : 'border-[#c4c4c4]'}`}>
                {checked && <span className="size-[12px] rounded-full bg-principal" />}
            </span>
            {label}
        </button>
    )
}