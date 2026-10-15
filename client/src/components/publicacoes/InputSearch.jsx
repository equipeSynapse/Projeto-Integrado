export function InputSearch({ value, onChange, onKeyDown, placeholder = "Pesquisar por título ou usuário" }) {
    return (
        <div className="relative flex items-center w-full max-w-[400px]">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#909090"
                strokeWidth="2"
                strokeLinecap="round"
                className="absolute left-[16px] size-[16px]"
                aria-hidden="true"
            >
                <circle cx="11" cy="11" r="7" />
                <line x1="16.5" y1="16.5" x2="21" y2="21" />
            </svg>
            
            <input
                type="text"
                value={value}
                onChange={onChange}
                onKeyDown={onKeyDown}
                placeholder={placeholder}
                className="bg-white border border-[#e5e5e5] focus:border-[#8d8d8d] border-solid font-poppins font-normal h-[48px] leading-none outline-none pl-[48px] pr-[48px] py-[10px] rounded-[50px] text-[#1f1f1f] text-[14px] w-full placeholder:text-[#909090]"
            />
        </div>
    );
}