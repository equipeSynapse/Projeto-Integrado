import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Check, MailWarning } from "lucide-react";
import checkMetIcon from "../../assets/icons/check-met.svg";
import checkUnmetIcon from "../../assets/icons/check-unmet.svg";
import { InputField } from "../../components/InputField";
import { getPasswordRequirements } from "../../components/CadastroForm";
import { redefinirSenha, validarToken } from "../../services/redefinirSenha";
import { esqueciSenha } from "../../services/esqueciSenha";
import Button from "../../components/Button";

function mascararEmail(email) {
    if (!email || !email.includes("@")) return email || "seu e-mail";
    const [usuario, dominio] = email.split("@");
    if (usuario.length <= 3) {
        return `${usuario}****@${dominio}`;
    }
    return `${usuario.slice(0, 3)}****@${dominio}`;
}

function extrairEmailDoToken(token) {
    if (!token) return "";
    try {
        const payloadBase64 = token.split(".")[1];
        if (!payloadBase64) return "";
        const decodedJson = atob(payloadBase64.replace(/-/g, "+").replace(/_/g, "/"));
        const parsed = JSON.parse(decodedJson);
        return parsed.email || parsed.sub || "";
    } catch {
        return "";
    }
}

export default function RedefinirSenhaPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const emailParam = searchParams.get("email");
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ senha: "", confirmarSenha: "" });
    const [touched, setTouched] = useState({ senha: false, confirmarSenha: false });
    const [serverError, setServerError] = useState("");
    const [sucesso, setSucesso] = useState(false);
    const [loading, setLoading] = useState(false);

    const [validandoToken, setValidandoToken] = useState(true);
    const [linkExpirado, setLinkExpirado] = useState(false);
    const [emailEnviado, setEmailEnviado] = useState(false);
    const [enviandoEmail, setEnviandoEmail] = useState(false);
    const [userEmail, setUserEmail] = useState("");

    useEffect(() => {
        if (!token) {
            setValidandoToken(false);
            return;
        }

        async function checarToken() {
            const emailBackup = emailParam || extrairEmailDoToken(token);
            if (emailBackup) {
                setUserEmail(emailBackup);
            }

            try {
                const data = await validarToken(token);
                if (data?.email) {
                    setUserEmail(data.email);
                }
            } catch (error) {
                if (error?.response?.status === 400 || error?.response?.status === 404) {
                    const emailCapturado =
                        error.response?.data?.email ||
                        error.response?.data?.user?.email ||
                        emailBackup;
                    if (emailCapturado) {
                        setUserEmail(emailCapturado);
                    }
                    setLinkExpirado(true);
                }
            } finally {
                setValidandoToken(false);
            }
        }

        checarToken();
    }, [token, emailParam]);

    const passwordRequirements = getPasswordRequirements(formData.senha || "");
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
            if (error?.response?.status === 400) {
                const emailCapturado =
                    error.response?.data?.email ||
                    error.response?.data?.user?.email ||
                    userEmail;
                if (emailCapturado) {
                    setUserEmail(emailCapturado);
                }
                setLinkExpirado(true);
            } else {
                setServerError("Erro de conexão. Tente novamente.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSolicitarNovoLink = async () => {
        if (enviandoEmail) return;
        setServerError("");

        const emailParaEnvio = userEmail || emailParam || extrairEmailDoToken(token);

        if (!emailParaEnvio) {
            setServerError("Não foi possível identificar o seu e-mail. Volte para a tela de login para solicitar.");
            return;
        }

        setEnviandoEmail(true);

        try {
            await esqueciSenha(emailParaEnvio);
            setEmailEnviado(true);
        } catch (error) {
            const mensagem = error?.response?.data?.message || error?.message || "Erro ao solicitar novo link. Tente novamente.";
            setServerError(mensagem);
        } finally {
            setEnviandoEmail(false);
        }
    };

    const renderContent = () => {
        if (validandoToken) {
            return (
                <div className="flex flex-col flex-1 items-center justify-center text-center">
                    <p className="font-poppins font-medium text-[16px] text-[#3c4043]">
                        Validando link...
                    </p>
                </div>
            );
        }

        if (!token) {
            return (
                <div className="flex flex-col flex-1 items-center text-center justify-between">
                    <div className="flex flex-col items-center mt-[20px]">
                        <p className="font-poppins font-semibold leading-none text-[28px] text-black">
                            Link inválido
                        </p>
                        <p className="font-poppins font-normal leading-[1.5] text-[#3c4043] text-[16px] mt-[14px] max-w-[462px]">
                            O link de redefinição está incompleto. Solicite um novo link na tela de login.
                        </p>
                    </div>
                    <Button onClick={() => navigate("/")} variant="cta" className="w-full rounded-full">
                        Ir para o início
                    </Button>
                </div>
            );
        }

        if (linkExpirado) {
            if (emailEnviado) {
                return (
                    <div className="flex flex-col items-center text-center">
                        <div className="bg-[#EBEBEB] rounded-full size-[80px] flex items-center justify-center shrink-0">
                            <Check className="size-[40px] text-[#3c4043]" strokeWidth={1.5} aria-hidden="true" />
                        </div>
                        <p className="font-poppins font-semibold leading-none text-[28px] text-[#3C4043] mt-[48px]">
                            E-mail enviado!
                        </p>
                        <p className="font-poppins font-normal leading-[1.5] text-[#3c4043] text-[16px] mt-[24px] max-w-[440px]">
                            Enviamos um novo link de redefinição de senha para{" "}
                            <span className="font-semibold text-[#3C4043]">{mascararEmail(userEmail)}</span>. Verifique sua caixa de entrada e siga as instruções para ativar sua conta.
                        </p>
                        <Button
                            onClick={() => navigate("/", { state: { abrirLogin: true } })}
                            variant="cta"
                            className="w-full rounded-full mt-[118px]"
                        >
                            Voltar para login
                        </Button>
                    </div>
                );
            }

            return (
                <div className="flex flex-col items-center text-center">
                    <div className="bg-[#EBEBEB] rounded-full size-[80px] flex items-center justify-center shrink-0">
                        <MailWarning className="size-[40px] text-[#3c4043]" strokeWidth={1.5} aria-hidden="true" />
                    </div>
                    <p className="font-poppins font-semibold leading-none text-[28px] text-[#3C4043] mt-[48px]">
                        Este link expirou
                    </p>
                    <p className="font-poppins font-normal leading-[1.5] text-[#3c4043] text-[16px] mt-[24px] max-w-[440px]">
                        O link de <span className="font-semibold">redefinição de senha</span> expirou. Solicite<br />um novo link para redefinir sua senha.
                    </p>
                    <div className="w-full mt-[118px] flex flex-col items-center">
                        <button
                            type="button"
                            onClick={handleSolicitarNovoLink}
                            disabled={enviandoEmail}
                            className="flex h-[48px] items-center justify-center w-full rounded-full bg-[#3c4043] hover:bg-black text-white font-poppins font-medium text-[15px] transition-colors disabled:bg-[#9d9fa1] cursor-pointer"
                        >
                            {enviandoEmail ? "Enviando..." : "Solicitar novo link"}
                        </button>
                        {serverError && (
                            <p className="font-poppins text-[13px] text-red-500 mt-[8px]">
                                {serverError}
                            </p>
                        )}
                    </div>
                </div>
            );
        }

        if (sucesso) {
            return (
                <div className="flex flex-col flex-1 items-center text-center justify-between">
                    <div className="flex flex-col items-center mt-[12px]">
                        <div className="bg-[#EBEBEB] rounded-full size-[80px] flex items-center justify-center shrink-0">
                            <Check className="size-[40px] text-[#3c4043]" strokeWidth={1.5} aria-hidden="true" />
                        </div>
                        <p className="font-poppins font-semibold leading-none text-[28px] text-[#3C4043] mt-[48px]">
                            Senha redefinida!
                        </p>
                        <p className="font-poppins font-normal leading-[1.5] text-[#3c4043] text-[16px] mt-[24px] max-w-[440px]">
                            Sua senha foi alterada com sucesso.
                        </p>
                        <div className="bg-[#f9f9f9] rounded-[8px] w-full mt-[20px] p-[20px] flex flex-col gap-[12px] text-left text-[#3c4043] text-[15px]">
                            <p className="font-poppins font-medium leading-none">Próximo passo</p>
                            <p className="font-poppins font-normal leading-[1.5]">
                                Agora você já pode acessar o Mural Colaborativo utilizando sua nova senha.
                            </p>
                        </div>
                    </div>
                    <Button onClick={() => navigate("/", { state: { abrirLogin: true } })} variant="cta" className="w-full rounded-full">
                        Ir para o login
                    </Button>
                </div>
            );
        }

        return (
            <>
                <div className="flex flex-col gap-[14px] items-center text-center mb-[24px]">
                    <p className="font-poppins font-semibold leading-none text-[28px] text-black">
                        Crie uma nova senha
                    </p>
                    <p className="font-poppins font-normal leading-[1.5] text-[#3c4043] text-[16px] max-w-[462px]">
                        Digite uma nova senha para acessar sua conta novamente.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col flex-1 justify-between">
                    <div className="flex flex-col gap-[20px] w-full">
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

                        <div className="flex flex-col gap-[10px] items-start justify-center w-full">
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

                    <div className="flex flex-col items-center w-full">
                        <button
                            type="submit"
                            disabled={!canSubmit}
                            className={`flex flex-col h-[48px] items-center justify-center w-full rounded-full ${canSubmit ? "bg-[#3c4043] hover:bg-black cursor-pointer" : "bg-[#9d9fa1] cursor-not-allowed"}`}
                        >
                            <p className="font-poppins font-medium text-[14px] text-center text-white">
                                {loading ? "Redefinindo..." : "Redefinir senha"}
                            </p>
                        </button>
                    </div>
                </form>
            </>
        );
    };

    return (
        <div className="min-h-screen bg-black/50 flex justify-center items-center p-[16px]">
            <div role="main" className="bg-white border border-[#e5e5e5] border-solid relative rounded-[16px] w-[564px] h-[520px] max-w-full p-[40px] flex flex-col">
                {renderContent()}
            </div>
        </div>
    );
}