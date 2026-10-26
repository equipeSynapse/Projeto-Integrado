import mailIcon from "../../assets/icons/mail.svg"
import phoneIcon from "../../assets/icons/phone.svg"
import Button from "../Button";
import copiarLink from "../../utils/copiarLink";
import timestampMsg from "../../utils/timestampMsg";
import viewObserver from "../../utils/viewObserver";
import isUserLoggedIn from "../../utils/auth";
import { useEffect, useState } from "react";
import { BiSolidFilePdf } from "react-icons/bi";
import { ArrowUpRight, Pencil, Trash } from "lucide-react";
import CopiarLinkBtn from "./CopiarLinkBtn";
import ExcluirPubModal from "./ExcluirPubModal";

export function PubliCard({ variant, id, autor, criadoEm, imagem, categoria, titulo, descricao,
                            contato, anexos, qtdVisualizacoes, expiracao }) {

  const cardRef = viewObserver(id)
  const [expandido, setExpandido] = useState(false)
              
  const usuario = isUserLoggedIn();
  const [threeDotsClicked, setThreeDotsClicked] = useState(false)
  const [excluirClicked, setExcluirClicked] = useState(false)

  // O contato guarda e-mail e/ou telefone separados por " / "
  const contatos = contato ? contato.split(' / ').filter(Boolean) : []

  return (
    <article ref={cardRef} tabIndex="0" aria-label={`Publicação ${titulo}`} className="bg-white border border-[#e5e5e5] border-solid rounded-[16px] p-[20px] flex flex-col gap-[24px] items-start w-full max-w-[778px] text-[14px] font-poppins">
      <div className="w-full flex justify-between items-start">
        <div className="flex gap-[12px]">
          <div className={`${autor[0].toLowerCase() < "l"? "bg-[#F072C5]":"bg-[#22D3EE]"} size-[40px] rounded-[50px] flex items-center justify-center`}> {autor[0].toUpperCase()} </div>
          <div className="flex flex-col justify-between">
            <span className="font-medium"> {autor} </span>
            <span> {categoria} · Publicado {timestampMsg(new Date(), new Date(criadoEm))} </span>
          </div>
        </div>

        <div className="relative flex gap-[24px] items-center">
          <div className="px-[12px] py-[6px] bg-[#e5e5e5] text-[12px] rounded-[50px]"> Expira em {new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(expiracao))} </div>
          {usuario.usuario === autor && 
            <button onClick={() => setThreeDotsClicked(!threeDotsClicked)}> 
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3C4043" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg> 
            </button>}
          {threeDotsClicked && 
            <div className="absolute flex flex-col items-start right-0 top-[36px] w-[250px] bg-white rounded-[8px] shadow-lg shadow-black/20 overflow-hidden"> 
                <button className="w-full flex items-center gap-[8px] text-left px-[16px] py-[12px] hover:bg-[rgba(60,64,67,0.06)]"> 
                  <Pencil className="size-[14px]"/>
                  <span className="text-[14px] relative top-[1px]"> Editar </span>
                </button>
                <button onClick={() => setExcluirClicked(true)} className="w-full flex items-center gap-[8px] text-left px-[16px] py-[12px] hover:bg-[rgba(60,64,67,0.06)] text-red-500"> 
                  <Trash className="size-[14px] stroke-red-500"/> 
                  <span className="text-[14px] relative top-[1px]"> Excluir </span> 
                </button>
            </div>}
        </div>
      </div>

      <div className="flex flex-col gap-[24px]">
        <h2 className="font-semibold leading-tight text-[16px] text-black">{titulo}</h2>
        <p className="className={`font-medium leading-stitch text-[14px] text-[#3c4043] whitespace-pre-wrap">
          {((expandido || descricao.length < 60) || variant === "completo") ? descricao : `${descricao.slice(0, descricao.lastIndexOf(' ', 60))}... `}
          {(!expandido && variant !== "completo") ? <button className="text-[#8d8d8d] font-medium hover:cursor-pointer" onClick={() => setExpandido(true)}> mostrar mais </button> : ''}
        </p>

        {(expandido || variant === "completo") && contatos.length > 0 ?
          <div className="flex flex-col gap-[24px]">
            <h3 className="font-semibold leading-none text-[14px] text-black"> Informações adicionais </h3>
            <div className="flex flex-col gap-[16px]">
              {contatos.map((c, index) =>
                <div key={index} className="flex items-center gap-[10px]">
                  <img src={c.includes('@') ? mailIcon : phoneIcon} className="size-[18px]" />
                  <span> {c} </span>
                </div>
              )}
            </div>
          </div>
          : ''}

        {(expandido || variant === "completo") && (anexos?.length > 0) ?
          <div className="flex flex-col gap-[24px]">
            <h3 className="font-semibold leading-none text-[14px] text-black"> Material anexado </h3>
            <div className="flex flex-col gap-[16px]">
              {anexos.map((anexo, index) =>
                <a
                  key={index}
                  href={anexo.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  alt={`Acessar Documento ${anexo.nome}`}
                  className="flex justify-between items-center h-[66px] px-[24px] py-[16px] border border-[#e5e5e5] rounded-[8px]"
                >
                  <div className="flex items-center gap-[10px]">
                    <BiSolidFilePdf size="24px" color="#EA4345" />
                    <div className="flex flex-col gap-[4px]">
                      <span> {anexo.nome} </span>
                      <span className="text-[12px] text-[#909090]"> {anexo.tipo} · {anexo.tamanho}kb </span>
                    </div>
                  </div>
                  <div> <ArrowUpRight size="18px" /> </div>
                </a>
              )}
            </div>
          </div>
        : ""}
      </div>

      {imagem && <div className="bg-[#e5e5e5] rounded-[16px] w-full min-h-[310px] shrink-0 overflow-hidden">
        <img src={`${imagem}#toolbar=0`} alt={titulo} className="size-full object-cover" />
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

      {excluirClicked && 
      <div className="bg-black/50 fixed z-2 h-full inset-0 flex items-center justify-center">
        <ExcluirPubModal onClickX={() => setExcluirClicked(false)}/>
      </div>}

    </article>
  );
}
