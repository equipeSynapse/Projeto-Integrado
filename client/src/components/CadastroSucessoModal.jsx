import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import closeIcon from "../assets/icons/close.svg";

export function CadastroSucessoModal({ email, onClose }) {
  useEffect(() => {
    const onKeyDown = (event) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cadastro-sucesso-titulo"
        onClick={(event) => event.stopPropagation()}
        className="bg-white rounded-[16px] relative w-141 max-w-full h-177.5 max-h-full flex flex-col items-center px-[31px] pt-[67px] pb-[33px]"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute cursor-pointer right-[31px] top-[31px] size-[24px]"
          aria-label="Fechar"
        >
          <img alt="" src={closeIcon} className="block size-full" />
        </button>

        {/* Ícone de Sucesso */}
        <div className="bg-[#D9D9D9] rounded-full size-[80px] flex items-center justify-center shrink-0">
          <Check className="size-[48px] text-[#3c4043]" strokeWidth={2} aria-hidden="true" />
        </div>

        {/* Título */}
        <h1
          id="cadastro-sucesso-titulo"
          className="font-poppins font-semibold leading-none text-[28px] text-black text-center mt-[32px]"
        >
          Cadastro realizado!
        </h1>

        {/* Mensagem sobre o envio do e-mail (com o e-mail obrigatoriamente na linha de baixo) */}
        <p className="font-poppins font-normal text-[16px] leading-[1.5] text-[#3c4043] text-center mt-[14px] w-full">
          Enviamos um e-mail de ativação para
          <span className="block font-medium text-[#3c4043] break-all mt-[2px]">
            {email}
          </span>
        </p>

        {/* Bloco "Próximo passo" */}
        <div className="bg-[#f8f8f8] rounded-[8px] w-full mt-[24px] p-[20px] flex flex-col gap-[8px]">
          <p className="font-poppins font-medium text-[16px] leading-[1.5] text-black">Próximo passo</p>
          <p className="font-poppins font-normal text-[16px] leading-[1.6] text-[#3c4043]">
            Acesse seu e-mail e clique no link de ativação para confirmar sua conta e começar a utilizar o Mural Colaborativo.
          </p>
        </div>

        {/* Botão de Ação */}
        <Link
          to="/login"
          autoFocus
          className="mt-auto w-full h-[48px] rounded-[50px] bg-[#3c4043] flex items-center justify-center font-poppins font-medium text-[14px] leading-none text-white hover:bg-[#2b2e30] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3c4043] transition-colors"
        >
          Ir para o login
        </Link>
      </div>
    </div>
  );
}