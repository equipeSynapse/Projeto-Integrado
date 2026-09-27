import { X, Check } from 'lucide-react'
import closeIcon from './assets/icons/close.svg'
import checkMetIcon from "./assets/icons/check-met.svg";
import checkUnmetIcon from "./assets/icons/check-unmet.svg";
import chevronLeftIcon from "./assets/icons/chevron-left.svg";
import { useState } from 'react'
import { InputField } from './components/ui/InputField'

function App() {
  const [labelTab, setLabelTab] = useState("Dados gerais")
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    nomeCompleto: "",
    nomeUsuario: "",
    email: "",
    senhaAtual: "",
    senhaNova: "",
    confirmarSenhaNova: ""
  });

  const passwordsMismatch = formData.confirmarSenhaNova.length > 0 && formData.confirmarSenhaNova !== formData.senhaNova;
  const isInputsEmpty = labelTab === "Dados gerais" ? (!formData.nomeCompleto || !formData.nomeUsuario || !formData.email) : 
                                                      (!formData.senhaAtual || !formData.senhaNova || !formData.confirmarSenhaNova)

  function handleChange(field) {
    return (event) => {
      setFormData((prev) => ({ ...prev, [field]: event.target.value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    };
  }

  function getPasswordRequirements(senha) {
    return [
      { label: "Mínimo de 08 caracteres", met: senha.length >= 8 },
      { label: "Letras maiúsculas e minúsculas (A-Z) e (a-z)", met: /[A-Z]/.test(senha) && /[a-z]/.test(senha) },
      { label: "Caracteres especiais (#, @, $, %, *)", met: /[#@$%*]/.test(senha) },
      { label: "Números (0-9)", met: /[0-9]/.test(senha) },
    ];
  }

  const passwordRequirements = getPasswordRequirements(formData.senhaNova);

  return (
    <>
      <div className="flex justify-center h-[100dvh]">
        <div className=" w-full md:w-[80%] md:w-[664px] h-full md:h-[800px] border border-[#e5e5e5] border-solid rounded-[16px] relative bg-[#fafafa]">
          <header className='bg-white border-b-2'>
            <div className="flex flex-row flex-start md:justify-between items-center px-[30px] pt-[30px] pb-[8px] md:pb-[12px] gap-4">
              <button className="size-[20px] md:size-[24px] order-first md:hidden"> <img src={chevronLeftIcon} /> </button>
              <h2 className="text-[20px] md:text-[20px]"> Editar Perfil </h2>
              <button onClick={() => console.log(isInputsEmpty, [!formData.senhaAtual, !formData.senhaNova, !formData.confirmarSenhaNova])} className="size-[20px] md:size-[24px] hidden md:block"> <img src={closeIcon} /> </button>
            </div>

            <div className="flex justify-center text-[12px] md:text-[14px] font-medium pt-3">
              <button onClick={() => setLabelTab("Dados gerais")} className={`${labelTab === 'Dados gerais' ? "border-b-2 md:border-b-4 border-black" : ""} p-[8px] md:p-[12px] w-30 md:w-70 transition-all`}>Dados gerais</button>
              <button onClick={() => setLabelTab("Senha")} className={`${labelTab === 'Senha' ? "border-b-2 md:border-b-4 border-black" : ""} p-[8px] md:p-[12px] w-30 md:w-70 transition-all`}>Senha</button>
            </div>
          </header>

          {labelTab === 'Dados gerais' ? (
            <div className='md:h-[620px] overflow-y-auto scrollbar-none'>
              <div className='relative mb-[48px] md:mb-[80px]'>
                <div className="bg-gray-400 h-[96px] w-full h-[124px] md:h-[210px]">  </div>
                <div className="bg-gray-200 aspect-square h-[110px] md:h-[160px] rounded-full absolute left-6 md:left-8 bottom-[-48px] md:bottom-[-72px]">  </div>
              </div>

              <form className="flex flex-col gap-8 px-[30px] py-[24px]">
                <InputField label="Nome completo" placeholder="Exemplo de nome completo" />

                <InputField label="Usuário" placeholder="Exemplo de nome de usuário" />

                <div className="flex flex-col gap-1 mb-[48px]">
                  <label className="text-[12px] md:text-[16px] font-medium"> Bio </label>
                  <textarea className="text-[12px] md:text-[16px] h-[80px] md:h-[130px] px-[8px] md:px-[16px] py-[10px] md:py-[16px] border bg-white rounded-sm resize-none" placeholder="Bio" />
                </div>

              </form>
            </div>) : (<div>
              <form className="flex flex-col gap-[32px] px-[30px] py-[24px]">
                <InputField id="senhaAtual" typeInput="password" label="Senha atual" onChange={handleChange("senhaAtual")}placeholder="Exemplo de senha atual" />

                <div className='flex flex-col gap-4'>
                  <InputField id="senhaNova" typeInput="password" label="Nova senha" onChange={handleChange("senhaNova")} placeholder="Exemplo de nova senha" />

                  <ul className='flex flex-col gap-[12px] md:gap-4 text-[12px] md:text-[14px] font-medium'>
                    {passwordRequirements.map(({label, met}) => 
                      <li className='flex flex-row items-center gap-2'> <img src={met? checkMetIcon:checkUnmetIcon} /> <span> {label} </span> </li>
                    )}
                  
                  </ul>
                </div>

                <div className='flex flex-col gap-4'>
                  <InputField id="confimarSenhaNova" typeInput="password" label="Confirmar senha" 
                              onChange={handleChange("confirmarSenhaNova")} 
                              borderInputColor= {passwordsMismatch ? 'border-[#d93025] focus:outline-none' : 'border-[#e5e5e5]'} placeholder="Exemplo de confirmar senha" />
                  {passwordsMismatch && (
                  <span className="text-[12px] text-[#d93025]">As senhas não coincidem. </span>
                  )}
                </div>

              </form>
            </div>)}

          <div className="absolute bottom-0 px-[16px] md:px-[30px] py-[16px] w-full bg-white border-t-2">
            <div className='flex justify-between items-center text-[12px] md:text-[14px] font-medium'>
              <button type="button" className="h-[42px] md:h-[48px] px-[18px] md:px-[20px] py-[4px] md:py-[8px] hover:bg-gray-100 rounded-full"> Cancelar </button>
              <button type="submit" className={`${isInputsEmpty ? 'bg-gray-100':'bg-[#3c4043]'} text-white h-[42px] md:h-[48px] px-[18px] md:px-[20px] py-[2px] md:py-[8px] rounded-full`}> Salvar </button>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

export default App