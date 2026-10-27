import closeIcon from '../assets/icons/close.svg'
import checkMetIcon from "../assets/icons/check-met.svg";
import checkUnmetIcon from "../assets/icons/check-unmet.svg";
import { ChevronLeft } from 'lucide-react';
import { useState } from 'react'
import { InputField } from './InputField'
import isUserLoggedIn from '../utils/auth';

export function EditProfileForm({ onClickX, onClickApagarConta }) {
    const [labelTab, setLabelTab] = useState("Conta")
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        nomeCompleto: isUserLoggedIn().nome,
        nomeUsuario: isUserLoggedIn().usuario,
        email: "",
        senhaAtual: "",
        senhaNova: "",
        confirmarSenhaNova: ""
    });

    const passwordsMismatch = formData.confirmarSenhaNova.length > 0 && formData.confirmarSenhaNova !== formData.senhaNova;
    const isInputsEmpty = labelTab === "Conta" ? (!formData.nomeCompleto || !formData.nomeUsuario || !formData.email) :
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
        <div className=" w-full md:w-[80%] md:w-[664px] h-full md:h-[800px] rounded-[16px] relative bg-[#fafafa] overflow-hidden font-poppins">
            <header className='bg-white border-b-2 border-[#e5e5e5] p-[2px]'>
                <div className="flex flex-row flex-start md:justify-between items-center px-[30px] pt-[30px] pb-[8px] md:pb-[12px] gap-4">
                    <button className="size-[20px] md:size-[24px] order-first md:hidden"> <ChevronLeft /> </button>
                    <h2 className="text-[20px] md:text-[20px] font-semibold"> Gerenciar Perfil </h2>
                    <button className="size-[20px] md:size-[24px] hidden md:block" onClick={onClickX}> <img src={closeIcon} /> </button>
                </div>

                <div className="flex justify-center text-[12px] md:text-[14px] font-medium pt-3">
                    <button onClick={() => setLabelTab("Conta")} className={`${labelTab === 'Conta' ? "border-b-2 md:border-b-4 border-black" : ""} p-[8px] md:p-[12px] w-30 md:w-70 transition-all`}>Conta</button>
                    <button onClick={() => setLabelTab("Segurança")} className={`${labelTab === 'Segurança' ? "border-b-2 md:border-b-4 border-black" : ""} p-[8px] md:p-[12px] w-30 md:w-70 transition-all`}>Segurança</button>
                </div>
            </header>

            {labelTab === 'Conta' &&
                <div className='md:h-[580px] overflow-y-auto scrollbar-none'>
                    <div className='relative mb-[48px] md:mb-[80px]'>
                        <div className="bg-gray-400 h-[96px] w-full h-[124px] md:h-[210px]">  </div>
                        <div className="bg-gray-200 aspect-square h-[110px] md:h-[160px] rounded-full absolute left-6 md:left-8 bottom-[-48px] md:bottom-[-72px]">  </div>
                    </div>

                    <form className="flex flex-col gap-8 px-[30px] pt-[24px]">
                        <InputField 
                            label="Nome completo" 
                            inputValue={formData.nomeCompleto}
                            inputPlaceholder="Exemplo de nome completo"
                        />

                        <InputField
                            label="Usuário"
                            inputValue={formData.nomeUsuario}
                            inputOnChange={handleChange("nomeUsuario")}
                            inputPlaceholder="Exemplo de nome de usuário"
                        />

                        <div className="flex flex-col gap-1 mb-[36px]">
                            <label className="text-[12px] md:text-[14px] font-medium"> Bio </label>
                            <textarea className="text-[12px] md:text-[14px] h-[80px] md:h-[130px] px-[8px] md:px-[16px] py-[10px] md:py-[16px] border border-[#e5e5e5] bg-white rounded-[8px] resize-none" placeholder="Bio" />
                        </div>

                    </form>

                    <div className='px-[30px] flex flex-col'>
                        <hr className='border-[#e5e5e5] mb-[24px]'/>
                        <span className='text-black text-[16px] font-medium mb-[6px]'> Exclusão de conta </span>
                        <span className='text-[#3c4043] text-[14px]'> Remova sua conta do Mural SMD </span>
                        <button 
                            onClick={onClickApagarConta}
                            className='text-[14px] my-[24px] py-[12px] rounded-[50px] font-medium text-[#ea4335] border border-[#e5e5e5] hover:bg-[#f4f4f4]'>
                            Apagar conta 
                        </button>
                    </div>
                    
                </div>}

            {labelTab === "Segurança" && <div>
                <form className="flex flex-col gap-[32px] px-[30px] py-[24px]">
                    <InputField inputId="senhaAtual" inputType="password" label="Senha atual" inputOnChange={handleChange("senhaAtual")} inputPlaceholder="Exemplo de senha atual" />

                    <div className='flex flex-col gap-4'>
                        <InputField inputId="senhaNova" inputType="password" label="Nova senha" inputOnChange={handleChange("senhaNova")} inputPlaceholder="Exemplo de nova senha" />

                        <ul className='flex flex-col gap-[12px] md:gap-4 text-[12px] md:text-[14px] font-medium'>
                            {passwordRequirements.map(({ label, met }) =>
                                <li className='flex flex-row items-center gap-2'> <img src={met ? checkMetIcon : checkUnmetIcon} /> <span> {label} </span> </li>
                            )}
                        </ul>
                    </div>
                    <div className='flex flex-col gap-4'>
                        <InputField inputId="confimarSenhaNova" inputType="password" label="Confirmar senha"
                            inputOnChange={handleChange("confirmarSenhaNova")}
                            errorVar={passwordsMismatch ? "As senhas não coincidem." : ""}
                            inputPlaceholder="Exemplo de confirmar senha" 
                        />
                    </div>

                </form>
            </div>}

            <div className="absolute bottom-0 px-[16px] md:px-[30px] py-[16px] w-full bg-white border-t-2 border-[#e5e5e5]">
                 <div className='flex justify-between items-center text-[12px] md:text-[14px] font-medium'>
                   <button type="button" className="h-[42px] md:h-[48px] px-[18px] md:px-[20px] py-[4px] md:py-[8px] hover:bg-gray-100 rounded-full"> Cancelar </button>
                   <button type="submit" className={`${isInputsEmpty ? 'bg-gray-100':'bg-[#3c4043]'} transition duration-500 text-white h-[42px] md:h-[48px] px-[18px] md:px-[20px] py-[2px] md:py-[8px] rounded-full`}> Salvar </button>
                 </div>
           </div>
        </div>)
}