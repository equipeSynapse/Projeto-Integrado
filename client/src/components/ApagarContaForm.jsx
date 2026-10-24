import { useState } from 'react'
import closeIcon from '../assets/icons/close.svg'
import { InputField } from './InputField'

export default function ApagarContaForm({ onClickX }) {

    const [formData, setFormData] = useState({
        nomeUsuario: "",
        senha: "",
        confirmacao: ""
    })

    const isInputsEmpty = !(formData.nomeUsuario && formData.senha && formData.confirmacao)

    function handleChange(field) {
        return (event) => {
            setFormData((prev) => ({ ...prev, [field]: event.target.value }));
            console.log(formData.confirmacao)
        };
    }


    return (
        <div className="relative w-[726px] h-[746px] bg-[#fafafa] rounded-[16px] overflow-hidden font-poppins">
            <header className='flex items-center p-[32px] justify-between bg-white border-b border-b-[#e5e5e5]'>
                <span className='text-[20px] font-semibold'> Apagar conta </span>
                <button className="size-[20px] md:size-[24px]" onClick={onClickX}> <img src={closeIcon} /> </button>
            </header>

            <div className='p-[32px] flex flex-col gap-[24px]'>
                <div className='flex flex-col gap-[12px] text-[#3c4043]'>
                    <span className='font-semibold text-[20px]'> É uma pena ver você partir </span>
                    <p className='text-[14px]'>
                        Depois que sua conta é desativada, seu perfil é removido permanentemente do
                        Mural SMD. Assim, seus dados e publicações serão removidos do sistema, não podendo ser recuperados.
                    </p>
                </div>

                <form className='flex flex-col gap-[24px]'>
                    <InputField
                        label="Usuário *"
                        inputPlaceholder="Usuário"
                        inputValue={formData.nomeUsuario}
                        inputOnChange={handleChange("nomeUsuario")}
                    />

                    <InputField
                        label="Senha *"
                        inputPlaceholder="Senha"
                        inputValue={formData.senha}
                        inputOnChange={handleChange("senha")}
                    />

                    <div className='flex items-center gap-[12px]'>
                        <input 
                            className='size-[16px]' 
                            type="checkbox" 
                            id="concordancia-exclusao" 
                            onChange={(event) => setFormData((prev) => ({ ...prev, ["confirmacao"]: event.target.checked }))} 
                        />
                        <label htmlFor="concordancia-exclusao" className='text-[14px] font-semibold'> Eu entendo que contas apagadas não podem ser recuperadas </label>
                    </div>
                </form>

            </div>

            <div className="absolute bottom-0 h-[110px] w-full bg-white border-t-2 border-[#e5e5e5] 
                            text-[14px] flex items-center justify-between py-[24px] px-[32px]">
                <button type="button" className="h-[42px] md:h-[48px] px-[18px] md:px-[20px] py-[4px] md:py-[8px] hover:bg-gray-100 rounded-full"> Cancelar </button>
                <button type="submit" className={`${isInputsEmpty ? 'bg-gray-100' : 'bg-[#3c4043]'} transition duration-500 text-white h-[42px] md:h-[48px] px-[18px] md:px-[20px] py-[2px] md:py-[8px] rounded-full`}> Desativar </button>
            </div>
        </div>
    )
}