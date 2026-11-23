import closeIcon from '../assets/icons/close.svg'
import checkMetIcon from "../assets/icons/check-met.svg";
import checkUnmetIcon from "../assets/icons/check-unmet.svg";
import { Check, ChevronLeft, X } from 'lucide-react';
import { useRef, useState } from 'react'
import { InputField } from './InputField'
import isUserLoggedIn from '../utils/auth';
import { atualizarPerfil } from '../services/atualizarPerfil';
import closeModal from '../utils/closeModal';
import Button from './Button';
import capa from "../assets/illustrations/Capa.png"

export function EditProfileForm({ onClickX, onClickApagarConta }) {
    const modalRef = useRef(null)
    closeModal(modalRef, onClickX)

    const [labelTab, setLabelTab] = useState("Conta")
    const [errors, setErrors] = useState({});
    const [enviando, setEnviando] = useState(false);
    const [formData, setFormData] = useState({
        nomeCompleto: isUserLoggedIn().nome,
        nomeUsuario: isUserLoggedIn().usuario,
        bio: isUserLoggedIn().bio || '',
        senhaAtual: "",
        senhaNova: "",
        confirmarSenhaNova: ""
    });
    const [erroServidor, setErroServidor] = useState("");

    const passwordsMismatch = formData.confirmarSenhaNova.length > 0 && formData.confirmarSenhaNova !== formData.senhaNova;
    const isInputsEmpty = labelTab === "Conta" ? !(formData.nomeCompleto && formData.nomeUsuario) :
        (!formData.senhaAtual || !formData.senhaNova || !formData.confirmarSenhaNova)

    function handleChange(field) {
        return (event) => {
            setFormData((prev) => ({ ...prev, [field]: event.target.value }));
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        };
    }

    async function handleSubmit(e) {
        e.preventDefault();
        console.log(1)
        if (isInputsEmpty || enviando) return;

        setEnviando(true);
        setErroServidor("");

        try {
            const payload = {
                nome_completo: isUserLoggedIn().nome,
                nome_usuario: isUserLoggedIn().usuario,
                bio: isUserLoggedIn().bio
            }

            if (labelTab === "Conta") {
                payload.nome_completo = formData.nomeCompleto,
                    payload.nome_usuario = formData.nomeUsuario,
                    payload.bio = formData.bio
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
        <div ref={modalRef} tabIndex={-1} className=" w-full md:w-[80%] md:w-[664px] h-full md:h-[800px] rounded-[16px] relative bg-[#fafafa] overflow-hidden font-poppins">
            <header className='bg-white border-b-2 border-[#e5e5e5] p-[2px]'>
                <div className="flex flex-row flex-start md:justify-between items-center px-[30px] pt-[30px] pb-[8px] md:pb-[12px] gap-4">
                    <button className="size-[20px] md:size-[24px] order-first md:hidden" onClick={onClickX} aria-label="Voltar e fechar a edição de perfil"> <ChevronLeft /> </button>
                    <h2 className="text-[24px] md:text-[24px] font-semibold font-bricolage"> Gerenciar Perfil </h2>
                    <button className="size-[20px] md:size-[24px] hidden md:block" onClick={onClickX} aria-label='Fechar modal de edição de perfil'>
                        <img src={closeIcon} />
                    </button>
                </div>

                <div role="tablist" aria-label="Seções do perfil" className="flex justify-center text-[12px] md:text-[14px] text-principal font-medium pt-3">
                    <button role="tab" aria-selected={labelTab === 'Conta'} onClick={() => setLabelTab("Conta")} className={`${labelTab === 'Conta' ? "border-b-2 md:border-b-4 border-principal" : ""} p-[8px] md:p-[12px] w-30 md:w-70 transition-all`}>Conta</button>
                    <button role="tab" aria-selected={labelTab === 'Segurança'} onClick={() => setLabelTab("Segurança")} className={`${labelTab === 'Segurança' ? "border-b-2 md:border-b-4 border-principal" : ""} p-[8px] md:p-[12px] w-30 md:w-70 transition-all`}>Segurança</button>
                </div>
            </header>

            {labelTab === 'Conta' &&
                <div className='md:h-[580px] overflow-y-auto scrollbar-none'>
                    <div className='relative mb-[48px] md:mb-[80px]'>
                        <div className="bg-gray-400 h-[96px] w-full h-[124px] md:h-[210px] bg-no-repeat bg-cover bg-center" style={{ backgroundImage: `url(${capa})` }} />
                        <div className="flex items-center justify-center bg-destaque size-[110px] md:size-[160px] [mask-image:url(assets/Molde.svg)] mask-contain mask-no-repeat absolute left-6 md:left-8 bottom-[-48px] md:bottom-[-72px]">
                            <span className='text-[80px] font-poppins'> {isUserLoggedIn().usuario[0].toUpperCase()} </span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-8 px-[30px] pt-[24px]">
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
                            errorVar={erroServidor === "Este nome de usuário já está em uso." ? "Este nome de usuário já está em uso." : ""}
                        />

                        <div className="flex flex-col gap-1 mb-[36px]">
                            <label className="text-[12px] md:text-[14px] font-medium"> Bio </label>
                            <textarea
                                value={formData.bio}
                                onChange={handleChange("bio")}
                                className="text-[12px] md:text-[14px] h-[80px] md:h-[130px] px-[8px] md:px-[16px] py-[10px] md:py-[16px] border border-[#e5e5e5] bg-white rounded-[8px] resize-none"
                                placeholder="Bio"
                            />
                        </div>

                    </form>

                    <div className='px-[30px] flex flex-col'>
                        <hr className='border-[#e5e5e5] mb-[24px]' />
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
                <form onSubmit={handleSubmit} className="flex flex-col gap-[32px] px-[30px] py-[24px]">

                    <InputField
                        inputId="senhaAtual"
                        inputType="password"
                        label={<span> Senha atual <span className='text-atencao'>*</span> </span>}
                        inputOnChange={handleChange("senhaAtual")}
                        inputPlaceholder="Exemplo de senha atual"
                        errorVar={erroServidor === "A senha atual informada está incorreta." ? "A senha atual informada está incorreta." : ""}
                    />


                    <div className='flex flex-col gap-4'>
                        <InputField inputId="senhaNova" inputType="password" label={<span> Nova senha <span className='text-atencao'>*</span> </span>} inputOnChange={handleChange("senhaNova")} inputPlaceholder="Exemplo de nova senha" />

                        <ul className='flex flex-col gap-[12px] md:gap-4 text-[12px] md:text-[14px] font-medium'>
                            {passwordRequirements.map(({ label, met }) => (
                                <div key={label} className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full">
                                    <div className="relative shrink-0 size-[14px]">
                                        {met ?
                                            <Check className={`size-[14px] ${met ? 'stroke-sucesso' : 'stroke-erro'}`} /> :
                                            <X className={`size-[14px] ${met ? 'stroke-sucesso' : 'stroke-erro'}`} />
                                        }
                                    </div>
                                    <div className="flex flex-col font-poppins font-medium justify-center leading-[0] relative shrink-0 text-[14px] whitespace-nowrap">
                                        <p className={`leading-[1.5] ${met ? 'text-sucesso' : 'text-erro'}`}>{label}</p>
                                    </div>
                                </div>
                            ))}
                        </ul>
                    </div>
                    <div className='flex flex-col gap-4'>
                        <InputField inputId="confimarSenhaNova" inputType="password" label={<span> Confirmar senha <span className='text-atencao'>*</span> </span>}
                            inputOnChange={handleChange("confirmarSenhaNova")}
                            errorVar={passwordsMismatch ? "As senhas não coincidem." : ""}
                            inputPlaceholder="Exemplo de confirmar senha"
                        />
                    </div>

                </form>
            </div>}

            <div className="absolute bottom-0 px-[16px] md:px-[30px] py-[16px] w-full bg-white border-t-2 border-[#e5e5e5]">
                <div className='flex justify-between items-center text-[12px] md:text-[14px] font-medium'>
                    <Button className="h-[42px] md:h-[48px] px-[18px] md:px-[20px] py-[4px] md:py-[8px]"> Cancelar </Button>
                    <Button
                        variant="cta"
                        onClick={handleSubmit}
                        loading={enviando}
                        // Na aba Segurança o botão troca a senha; na aba Conta, salva os dados do perfil
                        loadingText={labelTab === "Segurança" ? "Alterando..." : "Salvando..."}
                        className={`transition duration-500 !text-[12px] md:!text-[14px] h-[42px] md:h-[48px] !px-[18px] md:!px-[20px] !py-[2px] md:!py-[8px] !rounded-full ${enviando
                            ? ""
                            : isInputsEmpty
                                ? "!bg-disabled hover:!bg-disabled"
                                : ""
                            }`}
                    >
                        Salvar
                    </Button>
                </div>
            </div>
        </div>)
}