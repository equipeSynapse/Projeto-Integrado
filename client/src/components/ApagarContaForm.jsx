import { useState } from 'react'
import closeIcon from '../assets/icons/close.svg'
import { InputField } from './InputField'
import { excluirConta } from '../services/excluirConta'
import { useNavigate } from 'react-router-dom'

export default function ApagarContaForm({ onClickX }) {
    const navigate = useNavigate();
    const [excluindo, setExcluindo] = useState(false);
    const [erro, setErro] = useState("");

    const [formData, setFormData] = useState({
        nomeUsuario: "",
        senha: "",
        confirmacao: false
    })

    const isInputsEmpty = !(formData.nomeUsuario && formData.senha && formData.confirmacao)

    function handleChange(field) {
        return (event) => {
            const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
            setFormData((prev) => ({ ...prev, [field]: value }));
            setErro("");
        };
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (isInputsEmpty || excluindo) return;

        setExcluindo(true);
        setErro("");

        try {
            // Se necessário, você pode validar o nome de usuário/senha no backend ou direto pelo token
            await excluirConta();
            navigate("/");
            window.location.reload();
        } catch (error) {
            setErro(error.response?.data?.mensagem || "Não foi possível apagar a conta.");
            setExcluindo(false);
        }
    }

    return (
        <div className="relative w-[726px] h-[746px] bg-[#fafafa] rounded-[16px] overflow-hidden font-poppins">
            <header className='flex items-center p-[32px] justify-between bg-white border-b border-b-[#e5e5e5]'>
                <span className='text-[20px] font-semibold'> Apagar conta </span>
                <button type="button" className="size-[20px] md:size-[24px] cursor-pointer" onClick={onClickX}> <img src={closeIcon} /> </button>
            </header>

            <div className='p-[32px] flex flex-col gap-[24px]'>
                <div className='flex flex-col gap-[12px] text-[#3c4043]'>
                    <span className='font-semibold text-[20px]'> É uma pena ver você partir </span>
                    <p className='text-[14px]'>
                        Depois que sua conta é desativada, seu perfil é removido permanentemente do
                        Mural SMD. Assim, seus dados e publicações serão removidos do sistema, não podendo ser recuperados.
                    </p>
                </div>

                {erro && (
                    <div className="p-[12px] bg-red-50 border border-[#ea4335] text-[#ea4335] text-[13px] rounded-[8px]">
                        {erro}
                    </div>
                )}

                <form onSubmit={handleSubmit} className='flex flex-col gap-[24px]'>
                    <InputField
                        label="Usuário *"
                        inputPlaceholder="Usuário"
                        inputValue={formData.nomeUsuario}
                        inputOnChange={handleChange("nomeUsuario")}
                    />

                    <InputField
                        label="Senha *"
                        inputType="password"
                        inputPlaceholder="Senha"
                        inputValue={formData.senha}
                        inputOnChange={handleChange("senha")}
                    />

                    <div className='flex items-center gap-[12px]'>
                        <input 
                            className='size-[16px] cursor-pointer' 
                            type="checkbox" 
                            id="concordancia-exclusao" 
                            checked={formData.confirmacao}
                            onChange={handleChange("confirmacao")} 
                        />
                        <label htmlFor="concordancia-exclusao' className='text-[14px] font-semibold cursor-pointer"> Eu entendo que contas apagadas não podem ser recuperadas </label>
                    </div>
                </form>

            </div>

            <div className="absolute bottom-0 h-[110px] w-full bg-white border-t-2 border-[#e5e5e5] 
                            text-[14px] flex items-center justify-between py-[24px] px-[32px]">
                <button 
                    type="button" 
                    onClick={onClickX}
                    className="h-[42px] md:h-[48px] px-[18px] md:px-[20px] py-[4px] md:py-[8px] hover:bg-gray-100 rounded-full cursor-pointer"
                > 
                    Cancelar 
                </button>
                <button 
                    type="button" 
                    disabled={isInputsEmpty || excluindo}
                    onClick={handleSubmit}
                    className={`${isInputsEmpty || excluindo ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-[#ea4335] text-white hover:bg-red-600 cursor-pointer'} transition duration-500 h-[42px] md:h-[48px] px-[18px] md:px-[20px] py-[2px] md:py-[8px] rounded-full`}
                > 
                    {excluindo ? "Apagando..." : "Desativar"} 
                </button>
            </div>
        </div>
    )
}