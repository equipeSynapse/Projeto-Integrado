import closeIcon from '../assets/icons/close.svg'
import checkMetIcon from "../assets/icons/check-met.svg";
import checkUnmetIcon from "../assets/icons/check-unmet.svg";
import { ChevronLeft } from 'lucide-react';
import { useState } from 'react';
import { InputField } from './InputField';
import isUserLoggedIn from '../utils/auth';
import { atualizarPerfil } from '../services/atualizarPerfil';

export function EditProfileForm({ onClickX, onClickApagarConta }) {
    const usuarioLogado = isUserLoggedIn();
    const [labelTab, setLabelTab] = useState("Conta");
    const [errors, setErrors] = useState({});
    const [enviando, setEnviando] = useState(false);
    const [erroServidor, setErroServidor] = useState("");

    const [formData, setFormData] = useState({
        nomeCompleto: usuarioLogado?.nome || "",
        nomeUsuario: usuarioLogado?.usuario || "",
        bio: usuarioLogado?.bio || "",
        senhaAtual: "",
        senhaNova: "",
        confirmarSenhaNova: ""
    });

    function getPasswordRequirements(senha) {
        return [
            { label: "Mínimo de 08 caracteres", met: senha.length >= 8 },
            { label: "Letras maiúsculas e minúsculas (A-Z) e (a-z)", met: /[A-Z]/.test(senha) && /[a-z]/.test(senha) },
            { label: "Caracteres especiais (#, @, $, %, *)", met: /[#@$%*]/.test(senha) },
            { label: "Números (0-9)", met: /[0-9]/.test(senha) },
        ];
    }

    const passwordRequirements = getPasswordRequirements(formData.senhaNova);
    const todosRequisitosSenha = passwordRequirements.every((r) => r.met);
    const passwordsMismatch = formData.confirmarSenhaNova.length > 0 && formData.confirmarSenhaNova !== formData.senhaNova;

    const isInputsEmpty = labelTab === "Conta"
        ? (!formData.nomeCompleto.trim() || !formData.nomeUsuario.trim())
        : (!formData.senhaAtual.trim() || !formData.senhaNova.trim() || !formData.confirmarSenhaNova.trim() || !todosRequisitosSenha || passwordsMismatch);

    function handleChange(field) {
        return (event) => {
            setFormData((prev) => ({ ...prev, [field]: event.target.value }));
            setErrors((prev) => ({ ...prev, [field]: undefined }));
            setErroServidor("");
        };
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (isInputsEmpty || enviando) return;

        setEnviando(true);
        setErroServidor("");

        try {
            const payload = {
                nome_completo: formData.nomeCompleto,
                nome_usuario: formData.nomeUsuario,
                bio: formData.bio
            };

            if (labelTab === "Segurança") {
                payload.senhaAtual = formData.senhaAtual;
                payload.senhaNova = formData.senhaNova;
            }

            await atualizarPerfil(payload);
            onClickX?.();
            window.location.reload();
        } catch (error) {
            setErroServidor(error.response?.data?.mensagem || "Não foi possível atualizar o perfil.");
        } finally {
            setEnviando(false);
        }
    }

    return (
        <div className="w-full md:w-[664px] h-full md:h-[800px] rounded-[16px] relative bg-[#fafafa] overflow-hidden font-poppins">
            <header className="bg-white border-b-2 border-[#e5e5e5] p-[2px]">
                <div className="flex flex-row flex-start md:justify-between items-center px-[30px] pt-[30px] pb-[8px] md:pb-[12px] gap-4">
                    <button type="button" onClick={onClickX} className="size-[20px] md:size-[24px] order-first md:hidden"> <ChevronLeft /> </button>
                    <h2 className="text-[20px] md:text-[20px] font-semibold"> Gerenciar Perfil </h2>
                    <button type="button" className="size-[20px] md:size-[24px] hidden md:block cursor-pointer" onClick={onClickX}> <img src={closeIcon} /> </button>
                </div>

                <div className="flex justify-center text-[12px] md:text-[14px] font-medium pt-3">
                    <button type="button" onClick={() => { setLabelTab("Conta"); setErroServidor(""); }} className={`${labelTab === 'Conta' ? "border-b-2 md:border-b-4 border-black" : ""} p-[8px] md:p-[12px] w-30 md:w-70 transition-all cursor-pointer`}>Conta</button>
                    <button type="button" onClick={() => { setLabelTab("Segurança"); setErroServidor(""); }} className={`${labelTab === 'Segurança' ? "border-b-2 md:border-b-4 border-black" : ""} p-[8px] md:p-[12px] w-30 md:w-70 transition-all cursor-pointer`}>Segurança</button>
                </div>
            </header>

            {erroServidor && (
                <div className="mx-[30px] mt-[16px] p-[12px] bg-red-50 border border-[#ea4335] text-[#ea4335] text-[13px] rounded-[8px]">
                    {erroServidor}
                </div>
            )}

            {labelTab === 'Conta' && (
                <div className="md:h-[580px] overflow-y-auto scrollbar-none pb-[100px]">
                    <div className="relative mb-[48px] md:mb-[80px]">
                        <div className="bg-gray-400 w-full h-[124px] md:h-[210px]"> </div>
                        <div className="bg-[#22D3EE] flex items-center justify-center aspect-square h-[110px] md:h-[160px] rounded-full absolute left-6 md:left-8 bottom-[-48px] md:bottom-[-72px]">
                            <span className="text-[56px] font-medium text-[#073061]">
                                {formData.nomeUsuario?.[0]?.toUpperCase() || "U"}
                            </span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-8 px-[30px] pt-[24px]">
                        <InputField
                            label="Nome completo"
                            inputValue={formData.nomeCompleto}
                            inputOnChange={handleChange("nomeCompleto")}
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
                            <textarea
                                value={formData.bio}
                                onChange={handleChange("bio")}
                                className="text-[12px] md:text-[14px] h-[80px] md:h-[130px] px-[8px] md:px-[16px] py-[10px] md:py-[16px] border border-[#e5e5e5] bg-white rounded-[8px] resize-none outline-none focus:border-[#8d8d8d]"
                                placeholder="Bio"
                            />
                        </div>
                    </form>

                    <div className="px-[30px] flex flex-col">
                        <hr className="border-[#e5e5e5] mb-[24px]" />
                        <span className="text-black text-[16px] font-medium mb-[6px]"> Exclusão de conta </span>
                        <span className="text-[#3c4043] text-[14px]"> Remova sua conta do Mural SMD </span>
                        <button
                            type="button"
                            onClick={onClickApagarConta}
                            className="text-[14px] my-[24px] py-[12px] rounded-[50px] font-medium text-[#ea4335] border border-[#e5e5e5] hover:bg-[#f4f4f4] cursor-pointer"
                        >
                            Apagar conta
                        </button>
                    </div>
                </div>
            )}

            {labelTab === "Segurança" && (
                <div className="md:h-[580px] overflow-y-auto scrollbar-none pb-[100px]">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-[32px] px-[30px] py-[24px]">
                        <InputField
                            inputId="senhaAtual"
                            inputType="password"
                            label="Senha atual"
                            inputValue={formData.senhaAtual}
                            inputOnChange={handleChange("senhaAtual")}
                            inputPlaceholder="Exemplo de senha atual"
                        />

                        <div className="flex flex-col gap-4">
                            <InputField
                                inputId="senhaNova"
                                inputType="password"
                                label="Nova senha"
                                inputValue={formData.senhaNova}
                                inputOnChange={handleChange("senhaNova")}
                                inputPlaceholder="Exemplo de nova senha"
                            />

                            <ul className="flex flex-col gap-[12px] md:gap-4 text-[12px] md:text-[14px] font-medium">
                                {passwordRequirements.map(({ label, met }) => (
                                    <li key={label} className="flex flex-row items-center gap-2">
                                        <img src={met ? checkMetIcon : checkUnmetIcon} />
                                        <span> {label} </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="flex flex-col gap-4">
                            <InputField
                                inputId="confimarSenhaNova"
                                inputType="password"
                                label="Confirmar senha"
                                inputValue={formData.confirmarSenhaNova}
                                inputOnChange={handleChange("confirmarSenhaNova")}
                                errorVar={passwordsMismatch ? "As senhas não coincidem." : ""}
                                inputPlaceholder="Exemplo de confirmar senha"
                            />
                        </div>
                    </form>
                </div>
            )}

            <div className="absolute bottom-0 px-[16px] md:px-[30px] py-[16px] w-full bg-white border-t-2 border-[#e5e5e5]">
                <div className="flex justify-between items-center text-[12px] md:text-[14px] font-medium">
                    <button
                        type="button"
                        onClick={onClickX}
                        className="h-[42px] md:h-[48px] px-[18px] md:px-[20px] py-[4px] md:py-[8px] hover:bg-gray-100 rounded-full cursor-pointer"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        disabled={isInputsEmpty || enviando}
                        onClick={handleSubmit}
                        className={`${isInputsEmpty || enviando ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#3c4043] text-white cursor-pointer'} transition duration-300 h-[42px] md:h-[48px] px-[18px] md:px-[20px] py-[2px] md:py-[8px] rounded-full`}
                    >
                        {enviando ? "Salvando..." : "Salvar"}
                    </button>
                </div>
            </div>
        </div>
    );
}