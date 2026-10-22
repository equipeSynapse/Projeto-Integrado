import { useState } from "react";
import { Check } from "lucide-react";
import closeIcon from "../assets/icons/close.svg";
import { InputField } from "./InputField";
import { esqueciSenha } from "../services/esqueciSenha";
import Button from "./Button";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9.-]+\.)?ufc\.br$/i;

export default function EsqueciSenha({ onClickX, onClickVoltar, ref }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [enviado, setEnviado] = useState(false);

  // O botão só é habilitado com um e-mail institucional válido
  const isEmailValid = EMAIL_REGEX.test(email.trim());

  function handleChange(event) {
    setEmail(event.target.value);
    setError("");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Preencha este campo");
      return;
    }
    if (!isEmailValid) {
      setError("E-mail inválido. Utilize seu e-mail institucional.");
      return;
    }

    try {
      await esqueciSenha(email.trim());
      setEnviado(true);
    } catch {
      setError("Erro de conexão. Tente novamente.");
    }
  };

  return (
    <div ref={ref} role="dialog" tabIndex={-1} aria-modal="true" className={`bg-white overflow-clip relative rounded-[16px] w-[564px] max-w-full p-[32px] flex flex-col ${enviado ? "h-[710px]" : "h-[400px]"}`}>

      <button type="button" onClick={onClickX} className="absolute cursor-pointer right-[32px] top-[32px] size-[24px]" aria-label="Fechar">
        <img alt="Fechar" src={closeIcon} className="block inset-0 max-w-none size-full" />
      </button>

      {enviado ? (
        <div className="flex flex-col flex-1 items-center text-center mt-[36px]">
          {/* Ícone de Sucesso */}
          <div className="bg-[#D9D9D9] rounded-full size-[80px] flex items-center justify-center shrink-0">
            <Check className="size-[48px] text-[#3c4043]" strokeWidth={2} aria-hidden="true" />
          </div>

          <div className="flex flex-col gap-[14px] items-center mt-[32px]">
            <p className="font-poppins font-semibold leading-none text-[28px] text-black">
              E-mail enviado!
            </p>
            <p className="font-poppins font-normal leading-[1.5] text-[#3c4043] text-[16px] w-[462px] max-w-full flex flex-col items-center">
              <span>Enviamos um e-mail para redefinir sua senha para</span>
              <span className="font-medium break-all">{email.trim()}</span>
            </p>
          </div>

          {/* Bloco "Próximo passo" */}
          <div className="bg-[#f9f9f9] rounded-[8px] w-full mt-[32px] p-[24px] flex flex-col gap-[14px] text-left">
            <p className="font-poppins font-medium leading-none text-[16px] text-black">Próximo passo</p>
            <p className="font-poppins font-normal leading-[1.5] text-[16px] text-[#3c4043]">
              Acesse seu e-mail e clique no link enviado para redefinir sua senha e recuperar o acesso à sua conta. Caso não encontre o e-mail,{" "}
              <span className="font-medium">verifique sua caixa de spam ou lixo eletrônico.</span>
            </p>
          </div>

          <Button onClick={onClickVoltar} variant="cta" className="mt-auto w-full h-[45px]">
            Voltar para o login
          </Button>
        </div>
      ) : (
        <>
          <p className="font-poppins font-semibold leading-[1.2] text-[28px] text-black text-center mt-[36px] mb-[33px]">
            Insira seu e-mail para<br />redefinir a senha
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col flex-1">
            <InputField
              onBlur={() => !email.trim() && setError("Preencha este campo")}
              label="E-mail institucional*"
              inputId="email"
              inputType="text"
              inputValue={email}
              inputOnChange={handleChange}
              inputPlaceholder="E-mail institucional"
              errorVar={error}
            />

            <div className="mt-auto flex items-center justify-between w-full">
              <Button type="button" variant="text" onClick={onClickX} className="h-[45px] text-[#3c4043]">
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="cta"
                disabled={!isEmailValid}
                className={`h-[45px] ${isEmailValid ? "" : "bg-[#9d9fa1] hover:bg-[#9d9fa1] hover:cursor-not-allowed"}`}
              >
                Enviar
              </Button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
