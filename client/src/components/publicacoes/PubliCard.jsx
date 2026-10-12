export function PubliCard({ imagem, titulo, descricao }) {
  return (
    <article className="bg-white border border-[#e5e5e5] border-solid rounded-[16px] p-[24px] flex gap-[24px] items-start w-full">
      <div className="bg-[#e5e5e5] rounded-[16px] w-[240px] h-[160px] shrink-0 overflow-hidden">
        {imagem && <img src={imagem} alt={titulo} className="size-full object-cover" />}
      </div>
      <div className="flex flex-col gap-[12px]">
        <h2 className="font-poppins font-semibold leading-none text-[28px] text-black">{titulo}</h2>
        <p className="font-poppins font-normal leading-[1.5] text-[16px] text-[#3c4043]">{descricao}</p>
      </div>
    </article>
  );
}