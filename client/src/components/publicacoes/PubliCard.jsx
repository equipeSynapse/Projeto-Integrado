import link2Icon from "../../assets/icons/link-2.svg"
import mailIcon from "../../assets/icons/mail.svg"
import phoneIcon from "../../assets/icons/phone.svg"
import Button from "../Button";
import copiarLink from "../../utils/copiarLink";
import timestampMsg from "../../utils/timestampMsg";
import viewObserver from "../../utils/viewObserver";
import isUserLoggedIn from "../../utils/auth";
import { useState } from "react";
import CopiarLinkBtn from "./CopiarLinkBtn";

export function PubliCard({ variant, id, autor, criadoEm, imagem, categoria, titulo, descricao, link, email, telefone, qtdVisualizacoes, expiracao }) {
  const cardRef = viewObserver(id)
  const [expandido, setExpandido] = useState(false)

  return (
    <article ref={cardRef} tabIndex="0" aria-label={`Publicação ${titulo}`} className="bg-white border border-[#e5e5e5] border-solid rounded-[16px] p-[20px] flex flex-col gap-[24px] items-start w-full max-w-[777px] text-[14px] font-poppins">
      <div className="w-full flex justify-between items-start">
        <div className="flex gap-[12px]">
          <div className="bg-gray-200 size-[40px] rounded-[50px] flex items-center justify-center"> {autor[0].toUpperCase()} </div>
          <div className="flex flex-col justify-between">
            <span className="font-medium"> {autor} </span>
            <span> {categoria} · Publicado há {timestampMsg(new Date(), new Date(criadoEm))} </span>
          </div>
        </div>

        <div className="flex gap-[24px] items-center">
          <div className="px-[12px] py-[6px] bg-[#e5e5e5] text-[12px] rounded-[50px]"> Expira em {new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(expiracao))} </div>
          <button> <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3C4043" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg> </button>
        </div>
      </div>

      <div className="flex flex-col gap-[24px]">
        <h2 className="font-semibold leading-tight text-[16px] text-black">{titulo}</h2>
        <p className="className={`font-medium leading-stitch text-[14px] text-[#3c4043] whitespace-pre-line">
          {((expandido || descricao.length < 60) || variant === "completo")? descricao : `${descricao.slice(0, descricao.lastIndexOf(' ', 60))}... `} 
          {(!expandido && variant !== "completo") ? <button className="text-[#8d8d8d] font-medium hover:cursor-pointer" onClick={() => setExpandido(true)}> mostrar mais </button>:''}
        </p>
        
        {(expandido || variant === "completo") && (link || email || telefone) ?
          <div className="flex flex-col gap-[24px]">
            <h2 className="font-semibold leading-none text-[14px] text-black"> Informações adicionais </h2>
            <div className="flex flex-col gap-[16px]">
              {link ? <div className="flex items-center gap-[10px]">
                <img src={link2Icon} className="size-[18px] rotate-135" />
                <a href={link} className="underline" target="_blank" rel="noopener noreferrer"> {link} </a>
              </div> : ''}

              {email ? <div className="flex items-center gap-[10px]">
                <img src={mailIcon} className="size-[18px]" />
                <span> {email} </span>
              </div> : ''}

              {telefone ? <div className="flex items-center gap-[10px]">
                <img src={phoneIcon} className="size-[18px]" />
                <span> {telefone} </span>
              </div> : ''}
            </div>
          </div>
          : ''}
      </div>

      {imagem && <div className="bg-[#e5e5e5] rounded-[16px] w-full min-h-[310px] shrink-0 overflow-hidden">
         <img src={imagem} alt={titulo} className="size-full object-cover" />
      </div>}

      <hr className="w-full border-[#e5e5e5]" />

      <div className="w-full flex justify-between">
        <div className="flex items-center gap-[10px]">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#909090" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></svg>
          <span className="text-[#909090]"> {qtdVisualizacoes} visualizações </span>
        </div>
        <div className="flex gap-[12px]">
          <CopiarLinkBtn onClick={() => copiarLink(id)} />
          {isUserLoggedIn() && (<Button variant="text" className="text-[#ea4335]">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EA4335" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22V4a1 1 0 0 1 .4-.8A6 6 0 0 1 8 2c3 0 5 2 7.333 2q2 0 3.067-.8A1 1 0 0 1 20 4v10a1 1 0 0 1-.4.8A6 6 0 0 1 16 16c-3 0-5-2-8-2a6 6 0 0 0-4 1.528" /></svg>
            <span>  Denunciar  </span>
          </Button>)}
        </div>

      </div>

    </article>
  );
}
