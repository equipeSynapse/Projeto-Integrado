import { useState } from "react";
import closeIcon from "../assets/icons/close.svg";
import backArrowIcon from "../assets/icons/back-arrow.svg";
import checkMetIcon from "../assets/icons/check-met.svg";
import checkUnmetIcon from "../assets/icons/check-unmet.svg";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getPasswordRequirements(senha) {
  return [
    { label: "Mínimo de 08 caracteres", met: senha.length >= 8 },
    { label: "Letras maiúsculas e minúsculas (A-Z) e (a-z)", met: /[A-Z]/.test(senha) && /[a-z]/.test(senha) },
    { label: "Caracteres especiais (#, @, $, %, *)", met: /[#@$%*]/.test(senha) },
    { label: "Números (0-9)", met: /[0-9]/.test(senha) },
  ];
}

export default function CriarConta() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nomeCompleto: "",
    nomeUsuario: "",
    email: "",
    senha: "",
    confirmarSenha: "",
  });
  const [errors, setErrors] = useState({});
  const isStep2 = step === 2;
  const passwordRequirements = getPasswordRequirements(formData.senha);
  const isPasswordValid = passwordRequirements.every((requirement) => requirement.met);
  const passwordsMismatch =
    formData.confirmarSenha.length > 0 && formData.confirmarSenha !== formData.senha;
  const canSubmit = isPasswordValid && formData.confirmarSenha.length > 0 && !passwordsMismatch;
  const isStep1Valid =
    formData.nomeCompleto.trim() !== "" &&
    formData.nomeUsuario.trim() !== "" &&
    EMAIL_REGEX.test(formData.email.trim());

  function handleChange(field) {
    return (event) => {
      setFormData((prev) => ({ ...prev, [field]: event.target.value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    };
  }

  function handleContinue(event) {
    event.preventDefault();

    const nextErrors = {};
    if (!formData.nomeCompleto.trim()) nextErrors.nomeCompleto = "Campo obrigatório.";
    if (!formData.nomeUsuario.trim()) nextErrors.nomeUsuario = "Campo obrigatório.";
    if (!formData.email.trim()) {
      nextErrors.email = "Campo obrigatório.";
    } else if (!EMAIL_REGEX.test(formData.email.trim())) {
      nextErrors.email = "E-mail inválido.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) setStep(2);
  }

  function handleBack() {
    setStep(1);
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (canSubmit) console.log("Formulário enviado com sucesso:", formData);
  }

  return (
    <div className="bg-white border border-[#e5e5e5] border-solid h-[710px] relative rounded-[16px] w-[564px]">
      <button type="button" className="absolute cursor-pointer left-[509px] size-[24px] top-[31px]" aria-label="Fechar">
        <img alt="" src={closeIcon} className="absolute block inset-0 max-w-none size-full" />
      </button>

      <div
        className={`absolute content-stretch flex flex-col gap-[14px] items-center left-[31px] not-italic text-center top-[67px] ${
          isStep2 ? "w-[502px]" : "right-[31px]"
        }`}
      >
        <p className="font-poppins font-semibold leading-none min-w-full relative shrink-0 text-[28px] text-black w-[min-content]">
          Crie sua conta
        </p>
        <div className="flex flex-col font-poppins font-normal justify-center leading-[0] relative shrink-0 text-[#3c4043] text-[16px] w-[462px]">
          <p className="leading-[1.5]">
            Cadastre-se para publicar e acompanhar informações no Mural Colaborativo SMD.
          </p>
        </div>
      </div>

      <div className="-translate-x-1/2 absolute content-stretch flex h-[30px] items-center justify-center left-1/2 top-[181px]">
        <div className="bg-[#3c4043] content-stretch flex flex-col items-center justify-center relative rounded-[15px] shrink-0 size-[30px]">
          <p className="font-poppins font-normal leading-[normal] relative shrink-0 text-[14px] text-white whitespace-nowrap">
            1
          </p>
        </div>
        <div className="bg-[#3c4043] h-[3px] relative shrink-0 w-[70px]" />
        <div
          className={`content-stretch flex flex-col items-center justify-center relative rounded-[15px] shrink-0 size-[30px] ${
            isStep2 ? "bg-[#3c4043]" : "bg-[#e5e5e5]"
          }`}
        >
          <p
            className={`font-poppins font-normal leading-[normal] relative shrink-0 text-[14px] whitespace-nowrap ${
              isStep2 ? "text-white" : "text-[#3c4043]"
            }`}
          >
            2
          </p>
        </div>
      </div>

      {isStep2 ? (
        <form onSubmit={handleSubmit}>
          <div className="absolute bottom-[33px] flex flex-col justify-between left-[31px] right-[31px] top-[235px]">
            <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full">
              <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
                <label htmlFor="senha" className="font-poppins font-medium leading-none relative shrink-0 text-[14px] text-black w-full">
                  Senha *
                </label>
                <div className={`bg-white border ${errors.senha ? 'border-[#d93025]' : 'border-[#e5e5e5]'} border-solid content-stretch flex h-[48px] items-center overflow-clip px-[16px] py-[10px] relative rounded-[8px] shrink-0 w-full`}>
                  <input
                    id="senha"
                    type="password"
                    value={formData.senha}
                    onChange={handleChange("senha")}
                    placeholder="Digite sua senha"
                    className="font-poppins font-normal leading-none relative shrink-0 text-[#1f1f1f] text-[14px] w-full outline-none placeholder:text-[#909090]"
                  />
                </div>
              </div>

              <div className="content-stretch flex flex-col gap-[12px] items-start justify-center relative shrink-0 w-[364px]">
                {passwordRequirements.map(({ label, met }) => (
                  <div key={label} className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full">
                    <div className="relative shrink-0 size-[14px]">
                      <img
                        alt=""
                        src={met ? checkMetIcon : checkUnmetIcon}
                        className="absolute block inset-0 max-w-none size-full"
                      />
                    </div>
                    <div className="flex flex-col font-poppins font-medium justify-center leading-[0] relative shrink-0 text-[#3c4043] text-[14px] whitespace-nowrap">
                      <p className="leading-[1.5]">{label}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
                <label htmlFor="confirmarSenha" className="font-poppins font-medium leading-none relative shrink-0 text-[14px] text-black w-full">
                  Confirmar senha *
                </label>
                <div className={`bg-white border ${passwordsMismatch ? 'border-[#d93025]' : 'border-[#e5e5e5]'} border-solid content-stretch flex h-[48px] items-center overflow-clip px-[16px] py-[10px] relative rounded-[8px] shrink-0 w-full`}>
                  <input
                    id="confirmarSenha"
                    type="password"
                    value={formData.confirmarSenha}
                    onChange={handleChange("confirmarSenha")}
                    placeholder="Confirme sua senha"
                    className="font-poppins font-normal leading-none relative shrink-0 text-[#1f1f1f] text-[14px] w-full outline-none placeholder:text-[#909090]"
                  />
                </div>
                {passwordsMismatch && (
                  <p className="font-poppins font-normal text-[12px] text-[#d93025]">As senhas não coincidem.</p>
                )}
              </div>
            </div>

            <div className="content-stretch flex flex-col gap-[14px] items-center relative shrink-0 w-full">
              <button
                type="submit"
                disabled={!canSubmit}
                className={`content-stretch flex flex-col h-[48px] items-center justify-center overflow-clip px-[40px] py-[16px] relative rounded-[8px] shrink-0 w-full ${
                  canSubmit ? "bg-[#3c4043] cursor-pointer" : "bg-[#9d9fa1] cursor-not-allowed"
                }`}
              >
                <p className="font-poppins font-medium leading-none relative shrink-0 text-[14px] text-center text-white whitespace-nowrap">
                  Criar conta
                </p>
              </button>

              <button type="button" onClick={handleBack} className="content-stretch cursor-pointer flex gap-[8px] items-center relative shrink-0">
                <div className="relative shrink-0 size-[14px]">
                  <img alt="" src={backArrowIcon} className="absolute block inset-0 max-w-none size-full" />
                </div>
                <p className="font-poppins font-normal leading-[1.5] relative shrink-0 text-[14px] text-black text-center whitespace-nowrap">
                  Voltar
                </p>
              </button>
            </div>
          </div>
        </form>
      ) : (
        <form onSubmit={handleContinue}>
          <div className="absolute content-stretch flex flex-col gap-[24px] items-start left-[31px] right-[31px] top-[235px]">
            <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
              <label htmlFor="nomeCompleto" className="font-poppins font-medium leading-none relative shrink-0 text-[14px] text-black w-full">
                Nome completo *
              </label>
              <div className={`bg-white border ${errors.nomeCompleto ? 'border-[#d93025]' : 'border-[#e5e5e5]'} border-solid content-stretch flex h-[48px] items-center overflow-clip px-[16px] py-[10px] relative rounded-[8px] shrink-0 w-full`}>
                <input
                  id="nomeCompleto"
                  type="text"
                  value={formData.nomeCompleto}
                  onChange={handleChange("nomeCompleto")}
                  placeholder="Nome completo"
                  className="font-poppins font-normal leading-none relative shrink-0 text-[#1f1f1f] text-[14px] w-full outline-none placeholder:text-[#909090]"
                />
              </div>
              {errors.nomeCompleto && (
                <p className="font-poppins font-normal text-[12px] text-[#d93025]">{errors.nomeCompleto}</p>
              )}
            </div>

            <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
              <label htmlFor="nomeUsuario" className="font-poppins font-medium leading-none relative shrink-0 text-[14px] text-black w-full">
                Usuário *
              </label>
              <div className={`bg-white border ${errors.nomeUsuario ? 'border-[#d93025]' : 'border-[#e5e5e5]'} border-solid content-stretch flex h-[48px] items-center overflow-clip px-[16px] py-[10px] relative rounded-[8px] shrink-0 w-full`}>
                <input
                  id="nomeUsuario"
                  type="text"
                  value={formData.nomeUsuario}
                  onChange={handleChange("nomeUsuario")}
                  placeholder="Usuário"
                  className="font-poppins font-normal leading-none relative shrink-0 text-[#1f1f1f] text-[14px] w-full outline-none placeholder:text-[#909090]"
                />
              </div>
              {errors.nomeUsuario && (
                <p className="font-poppins font-normal text-[12px] text-[#d93025]">{errors.nomeUsuario}</p>
              )}
            </div>

            <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
              <label htmlFor="email" className="font-poppins font-medium leading-none relative shrink-0 text-[14px] text-black w-full">
                E-mail institucional *
              </label>
              <div className={`bg-white border ${errors.email ? 'border-[#d93025]' : 'border-[#e5e5e5]'} border-solid content-stretch flex h-[48px] items-center overflow-clip px-[16px] py-[10px] relative rounded-[8px] shrink-0 w-full`}>
                <input
                  id="email"
                  type="text"
                  value={formData.email}
                  onChange={handleChange("email")}
                  placeholder="exemplo@ufc.br"
                  className={`font-poppins font-normal leading-none relative shrink-0 text-[14px] w-full outline-none placeholder:text-[#909090]`}
                />
              </div>
              {errors.email && (
                <p className="font-poppins font-normal text-[12px] text-[#d93025]">{errors.email}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="absolute content-stretch cursor-pointer flex flex-col h-[48px] items-center justify-center left-[31px] right-[31px] rounded-[8px] top-[594px]"
            style={
              isStep1Valid
                ? { backgroundColor: "#3c4043" }
                : {
                    backgroundImage:
                      "linear-gradient(90deg, rgba(60, 64, 67, 0.5) 0%, rgba(60, 64, 67, 0.5) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)",
                  }
            }
          >
            <p className="font-poppins font-medium leading-none relative shrink-0 text-[14px] text-center text-white whitespace-nowrap">
              Continuar
            </p>
          </button>

          <p className="absolute font-poppins font-normal leading-[0] left-[54px] right-[54px] text-[14px] text-black text-center top-[656px]">
            <span className="leading-[1.5]">Já tem uma conta? </span>
            <button type="button" className="font-poppins font-medium leading-[1.5] cursor-pointer">
              Entrar
            </button>
          </p>
        </form>
      )}
    </div>
  );
}
