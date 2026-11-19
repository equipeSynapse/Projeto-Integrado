export default function Button({ variant, children, className, onClick, disabled, loading, loadingText, type, ...props }) {
    const variantStyles = {
        cta: 'px-[24px] py-[12px] bg-[#5B2B82] flex justify-center items-center text-[14px] gap-[12px] rounded-[50px] w-fit font-medium font-poppins text-white hover:bg-[#482064] hover:cursor-pointer',
        text: 'px-[24px] py-[12px] flex justify-center items-center gap-[12px] text-[14px] text-[#5B2B82] rounded-[50px] w-fit font-medium font-poppins hover:bg-[rgba(60,64,67,0.06)] hover:cursor-pointer',
        second: 'px-[24px] py-[12px] border-1 border-[#e5e5e5] flex justify-center items-center gap-[12px] text-[14px] w-fit rounded-[50px] font-medium font-poppins hover:bg-[rgba(60,64,67,0.06)] hover:cursor-pointer'
    }

    const loadingStyles = loading
        ? `!cursor-wait ${variant === 'cta' ? '!bg-[#C8B8D4] hover:!bg-[#C8B8D4]' : ''}`
        : ''

    return (
        <button
            {...props}
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            aria-busy={loading ? true : undefined}
            className={`${variant ? variantStyles[variant] : variantStyles['text']} ${disabled ? 'disabled:bg-[#9d9fa1] disabled:hover:bg-[#9d9fa1] disabled:hover:cursor-not-allowed' : ''} ${loadingStyles} ${className || ''}`}
        >
            {loading ? (
                <>
                    <svg
                        className="animate-spin w-[18px] h-[18px] shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                    >
                        <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeDasharray="47 16"
                        />
                    </svg>
                    <span>{loadingText || 'Carregando...'}</span>
                </>
            ) : (
                children
            )}
        </button>
    )
}