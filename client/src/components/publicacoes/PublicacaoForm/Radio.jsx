export default function Radio({ label, checked, onClick }) {
    return (
        <button type="button" onClick={onClick} className="flex items-center gap-[8px] font-poppins text-[14px] text-[#3c4043] cursor-pointer">
            <span className={`size-[22px] rounded-full border flex items-center justify-center ${checked ? 'border-[#3c4043]' : 'border-[#c4c4c4]'}`}>
                {checked && <span className="size-[12px] rounded-full bg-[#3c4043]" />}
            </span>
            {label}
        </button>
    )
}