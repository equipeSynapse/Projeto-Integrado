import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Check } from "lucide-react";
import checkMetIcon from "../../assets/icons/check-met.svg";
import checkUnmetIcon from "../../assets/icons/check-unmet.svg";
import { InputField } from "../../components/InputField";
import { getPasswordRequirements } from "../../components/CadastroForm";
import { redefinirSenha } from "../../services/redefinirSenha";
import Button from "../../components/Button";

export default function RedefinirSenhaPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ senha: "", confirmarSenha: "" });
    const [touched, setTouched] = useState({ senha: false, confirmarSenha: false });
    const [serverError, setServerError] = useState("");
    const [sucesso, setSucesso] = useState(false);
    const [loading, setLoading] = useState(false);

    const passwordRequirements = getPasswordRequirements(formData.senha);
    const isPasswordValid = passwordRequirements.every((requirement) => requirement.met);
    const passwordsMismatch =
        formData.confirmarSenha.length > 0 && formData.confirmarSenha !== formData.senha;
    const canSubmit = isPasswordValid && formData.confirmarSenha.length > 0 && !passwordsMismatch && !loading;

    function handleChange(field) {
        return (event) => {
            setFormData((prev) => ({ ...prev, [field]: event.target.value }));
            setServerError("");
        };
    }

    function handleBlur(field) {
        return () => {
            setTouched((prev) => ({ ...prev, [field]: true }));
        };
    }

    const getSenhaError = () => {
        if (touched.senha && !formData.senha) {
            return "Preencha este campo";
        }
        if (passwordsMismatch) {
            return "As senhas não coincidem.";
        }
        return "";
    };

    const getConfirmarSenhaError = () => {
        if (touched.confirmarSenha && !formData.confirmarSenha) {
            return "Preencha este campo";
        }
        if (passwordsMismatch) {
            return "As senhas não coincidem.";
        }
        return serverError;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        setTouched({ senha: true, confirmarSenha: true });

        if (!canSubmit || loading) return;

        setLoading(true);

        try {
            await redefinirSenha(token, formData.senha);
            setSucesso(true);
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setServerError("Link de redefinição inválido ou expirado. Solicite um novo link.");
            } else {
                setServerError("Erro de conexão. Tente novamente.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black/50 flex justify-center items-center p-[16px]">
            <div role="main" className={`bg-white border border-[#e5e5e5] border-solid relative rounded-[16px] w-141 max-w-full p-[31px] flex flex-col ${sucesso ? "min-h-177.5" : "min-h-[550px]"}`}>

                {!token ? (
                    <div className="flex flex-col flex-1 items-center text-center mt-[36px]">
                        <p className="font-poppins font-semibold leading-none text-[28px] text-black">
                            Link inválido
                        </p>
                        <p className="font-poppins font-normal leading-[1.5] text-[#3c4043] text-[16px] mt-[14px] max-w-[462px]">
                            O link de redefinição está incompleto. Solicite um novo link na tela de login.
                        </p>
                        <Button onClick={() => navigate("/")} variant="cta" className="mt-auto w-full">
                            Ir para o início
                        </Button>
                    </div>
                ) : sucesso ? (
                    <div className="flex flex-col flex-1 items-center text-center mt-[36px]">
                        <div className="bg-[#D9D9D9] rounded-full size-[80px] flex items-center justify-center shrink-0">
                            <Check className="size-[48px] text-[#3c4043]" strokeWidth={1.5} aria-hidden="true" />
                        </div>
                        <p className="font-poppins font-semibold leading-none text-[28px] text-[#3c4043] mt-[32px]">
                            Senha redefinida!
                        </p>
                        <p className="font-poppins font-normal leading-[1.5] text-[#3c4043] text-[16px] mt-[14px] max-w-[462px]">
                            Sua senha foi alterada com sucesso.
                        </p>
                        <div className="bg-[#f9f9f9] rounded-[8px] w-full mt-[32px] p-[24px] flex flex-col gap-[14px] text-left text-[#3c4043] text-[16px]">
                            <p className="font-poppins font-medium leading-none">Próximo passo</p>
                            <p className="font-poppins font-normal leading-[1.5]">
                                Agora você já pode acessar o Mural Colaborativo utilizando sua nova senha.
                            </p>
                        </div>
                        <Button onClick={() => navigate("/", { state: { abrirLogin: true } })} variant="cta" className="mt-auto w-full">
                            Ir para o login
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="flex flex-col gap-[14px] items-center text-center mt-[36px] mb-[40px]">
                            <p className="font-poppins font-semibold leading-none text-[28px] text-black">
                                Crie uma nova senha
                            </p>
                            <p className="font-poppins font-normal leading-[1.5] text-[#3c4043] text-[16px] max-w-[462px]">
                                Digite uma nova senha para acessar sua conta novamente. 
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col flex-1">
                            <div className="flex flex-col gap-[24px] w-full">
                                <InputField
                                    label="Nova senha *"
                                    inputId="senha"
                                    inputType="password"
                                    inputValue={formData.senha}
                                    inputOnChange={handleChange("senha")}
                                    onBlur={handleBlur("senha")}
                                    inputPlaceholder="Digite sua nova senha"
                                    errorVar={getSenhaError()}
                                />

                                <div className="flex flex-col gap-[12px] items-start justify-center w-full">
                                    {passwordRequirements.map(({ label, met }) => (
                                        <div key={label} className="flex gap-[12px] items-center w-full">
                                            <div className="relative shrink-0 size-[14px]">
                                                <img
                                                    alt=""
                                                    src={met ? checkMetIcon : checkUnmetIcon}
                                                    className="absolute block inset-0 max-w-none size-full"
                                                />
                                            </div>
                                            <p className="font-poppins font-medium leading-[1.5] text-[#3c4043] text-[14px] whitespace-nowrap">{label}</p>
                                        </div>
                                    ))}
                                </div>

                                <InputField
                                    label="Confirmar nova senha *"
                                    inputId="confirmarSenha"
                                    inputType="password"
                                    inputValue={formData.confirmarSenha}
                                    inputOnChange={handleChange("confirmarSenha")}
                                    onBlur={handleBlur("confirmarSenha")}
                                    inputPlaceholder="Confirme sua nova senha"
                                    errorVar={getConfirmarSenhaError()}
                                />
                            </div>

                            <div className="mt-auto pt-[40px] flex flex-col items-center w-full">
                                <button
                                    type="submit"
                                    disabled={!canSubmit}
                                    className={`flex flex-col h-[48px] items-center justify-center w-full rounded-[8px] ${canSubmit ? "bg-[#3c4043] hover:bg-black cursor-pointer" : "bg-[#9d9fa1] cursor-not-allowed"}`}
                                >
                                    <p className="font-poppins font-medium text-[14px] text-center text-white">
                                        {loading ? "Redefinindo..." : "Redefinir senha"}
                                    </p>
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}