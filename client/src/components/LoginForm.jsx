import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import closeIcon from "../assets/icons/close.svg";
import { InputField } from "./InputField";
import { loginUsuario } from "../services/login";

// Garantir que o usuário insira um e-mail válido antes de tentar logar
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@(alu\.)?ufc\.br$/i;

export default function LoginConta() {
  const navigate = useNavigate(); // Redirecionar página
  //Criando Fom com email e senha
  const [formData, setFormData] = useState({
    email: "",
    senha: "",
  });
  
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(""); 
  
  // Validação simples para habilitar/desabilitar o botão
  // O formulário só pode ser submetido se o email não estiver vazio, e a senha não estiver vazia
  const isFormValid = EMAIL_REGEX.test(formData.email.trim()) && formData.senha.length > 0;

  // Função para atualizar o estado quando o usuário digita
  function handleChange(field) {
    return (event) => {
      setFormData((prev) => ({ ...prev, [field]: event.target.value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
      setServerError(""); 
    };
  }

  // Função de submissão Login
  const handleSubmit = async (e) => {
    e.preventDefault();

    const nextErrors = {};
    
    // 1. Erro de campo vazio 
    if (!formData.email.trim()) {
      nextErrors.email = "Preencha este campo"; 
    } else if (!EMAIL_REGEX.test(formData.email.trim())) {
      nextErrors.email = "E-mail inválido. Utilize seu e-mail institucional.";
    }

    if (!formData.senha.trim()) {
      nextErrors.senha = "Preencha este campo"; 
    }
  
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      try {
        const response = await loginUsuario({ email: formData.email, senha: formData.senha });
        console.log("Login realizado com sucesso", response);
        localStorage.setItem("token", response.token);
        navigate("/");
      } catch (error) {
        // 2. Erro de credenciais incorretas 
        if (error.response && error.response.status === 401) {
          setErrors({
            email: "E-mail ou senha incorreta",
            senha: "E-mail ou senha incorreta"
          });
        } else {
          // Caso seja outro erro
          setErrors({ email: "Erro de conexão. Tente novamente." });
        }
      }
  }
}


  return (
    
    <div className="bg-white border border-[#e5e5e5] border-solid min-h-[550px] relative rounded-[16px] w-141 p-[31px] flex flex-col">
      
       {/*Botão X ------ Vai pra onde?*/}
      <button type="button" className="absolute cursor-pointer right-[31px] top-[31px] size-[24px]" aria-label="Fechar">
        <img alt="Fechar" src={closeIcon} className="block inset-0 max-w-none size-full" />
      </button>

      {}
      <div className="flex flex-col gap-[14px] items-center text-center mt-[36px] mb-[40px]">
        <p className="font-poppins font-semibold leading-none text-[28px] text-black">
          Boas-vindas
        </p>
        <p className="font-poppins font-normal leading-[1.5] text-[#3c4043] text-[16px] max-w-[462px]">
          Use seu email institucional para entrar no Mural Colaborativo SMD.
        </p>
      </div>

     
      <form onSubmit={handleSubmit} className="flex flex-col flex-1">
        
        {/*Campos de Texto*/}
        <div className="flex flex-col gap-[24px] w-full">
          <InputField
            label="E-mail institucional *"
            inputId="email"
            inputType="text" 
            inputValue={formData.email}
            inputOnChange={handleChange("email")}
            inputPlaceholder="exemplo@ufc.br"
            errorVar={errors.email}
          />

          <InputField
            label="Senha *"
            inputId="senha"
            inputType="password"
            inputValue={formData.senha}
            inputOnChange={handleChange("senha")}
            inputPlaceholder="Digite sua senha"
            errorVar={errors.senha}
          />
          
          {/*Botão: Esqueceu a senha*/}
          <div className="w-full flex justify-end mt-[-10px]">
            <Link to="/esqueceuSenha" className="font-poppins font-medium text-[14px] text-black cursor-pointer hover:underline">
              Esqueceu sua senha?
            </Link>
          </div>  
        </div>

        {/*Botão: Enviar*/}
        <div className="mt-auto pt-[80px] flex flex-col gap-[16px] items-center w-full">
          <button
            type="submit"
            className={`flex flex-col h-[48px] items-center justify-center w-full rounded-[8px] bg-[#3c4043] hover:bg-black cursor-pointer
            }`}
            /* OU disabled={!isFormValid}
            className={`flex flex-col h-[48px] items-center justify-center w-full rounded-[8px] transition-colors ${
              isFormValid ? "bg-[#3c4043] hover:bg-black cursor-pointer" : "bg-[#9d9fa1] cursor-not-allowed"  || Os 2 juntos nn fzm sentido*/
          >
            <p className="font-poppins font-medium text-[14px] text-center text-white">
              Entrar
            </p>
          </button>

           {/*Botão: Mudar para Cadastro*/}
          <p className="font-poppins font-normal text-[14px] text-black text-center">
            <span className="leading-[1.5]">Ainda não tem uma conta? </span>
            <Link to="/cadastro" className="font-poppins font-medium leading-[1.5] cursor-pointer underline">
              Registre-se
            </Link>
          </p>
        </div>

      </form>
    </div>
  );
}