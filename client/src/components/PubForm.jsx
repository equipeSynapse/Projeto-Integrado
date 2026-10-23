import { useState } from "react";
import { useNavigate } from "react-router-dom";
import closeIcon from "../assets/icons/close.svg";
import { InputField } from "./InputField";
import { createPub } from "../services/createpub";

export default function PubForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    categoria: "",
    imagem: "",
    telefone: "",
    link: "",
    expiracao: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [successToast, setSuccessToast] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatarTelefone = (valor) => {
    let numero = valor.replace(/\D/g, "");
    numero = numero.substring(0, 11);

    if (numero.length > 2) {
      numero = `(${numero.substring(0, 2)}) ${numero.substring(2)}`;
    }
    if (numero.length > 7) {
      numero = `${numero.substring(0, 10)}-${numero.substring(10)}`;
    }
    return numero;
  };

  function handleChange(field) {
    return (event) => {
      let valorInput = event.target.value;

      if (field === "telefone") {
        valorInput = formatarTelefone(valorInput);
      }

      setFormData((prev) => ({ ...prev, [field]: valorInput }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
      setServerError("");
    };
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nextErrors = {};

    if (!formData.titulo.trim()) nextErrors.titulo = "O título é obrigatório";
    if (!formData.descricao.trim()) nextErrors.descricao = "Insira uma descrição";
    if (!formData.categoria) nextErrors.categoria = "Selecione uma categoria";
    if (!formData.expiracao) nextErrors.expiracao = "Defina uma data de validade";

    if (formData.telefone) {
      const apenasNumeros = formData.telefone.replace(/\D/g, "");
      if (apenasNumeros.length < 10) {
        nextErrors.telefone = "Insira o número completo com DDD";
      }
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      setIsSubmitting(true);
      try {
        await createPub({
          ...formData,
          qtd_visualizacoes: 0,
        });

        // Dispara o toast de sucesso
        setSuccessToast(true);

        // Aguarda 1.8 segundos para o usuário ver o aviso antes de redirecionar
        setTimeout(() => {
          navigate("/");
        }, 1800);
      } catch (error) {
        setServerError("Erro ao criar publicação. Tente novamente mais tarde.");
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="bg-white border border-[#e5e5e5] border-solid min-h-[550px] relative rounded-[16px] w-full max-w-[600px] p-[31px] flex flex-col mx-auto my-8">
      {/* Toast de Sucesso fixado no topo da tela */}
      {successToast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-emerald-600 text-white px-5 py-3 rounded-lg shadow-xl font-poppins text-sm transition-all animate-bounce">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span>Publicação criada com sucesso! Redirecionando...</span>
        </div>
      )}

      <button 
        type="button" 
        onClick={() => navigate(-1)} 
        className="absolute cursor-pointer right-[31px] top-[31px] size-[24px]" 
        aria-label="Fechar"
      >
        <img alt="Fechar" src={closeIcon} className="block inset-0 max-w-none size-full" />
      </button>

      <div className="flex flex-col gap-[14px] items-center text-center mt-[36px] mb-[40px]">
        <p className="font-poppins font-semibold leading-none text-[28px] text-black">
          Nova Publicação
        </p>
        <p className="font-poppins font-normal leading-[1.5] text-[#3c4043] text-[16px] max-w-[462px]">
          Preencha os dados abaixo para adicionar um novo item ao Mural Colaborativo SMD.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col flex-1 gap-[24px]">
        {serverError && (
          <p className="text-red-500 font-poppins text-sm text-center">{serverError}</p>
        )}

        <InputField
          label="Título da publicação *"
          inputId="titulo"
          inputType="text" 
          inputValue={formData.titulo}
          inputOnChange={handleChange("titulo")}
          inputPlaceholder="Ex: Vaga de Estágio em Design"
          errorVar={errors.titulo}
        />

        <div className="flex flex-col gap-[8px] w-full">
          <label htmlFor="descricao" className="font-poppins font-medium text-[14px] text-black">
            Descrição *
          </label>
          <textarea
            id="descricao"
            value={formData.descricao}
            onChange={handleChange("descricao")}
            placeholder="Detalhes da publicação..."
            rows={4}
            className={`w-full rounded-[8px] border p-3 font-poppins text-[14px] resize-none focus:outline-none ${
              errors.descricao ? "border-red-500" : "border-[#e5e5e5] focus:border-black"
            }`}
          />
          {errors.descricao && <span className="text-red-500 text-xs font-poppins">{errors.descricao}</span>}
        </div>

        <div className="flex flex-col gap-[8px] w-full">
          <label htmlFor="categoria" className="font-poppins font-medium text-[14px] text-black">
            Categoria *
          </label>
          <select
            id="categoria"
            value={formData.categoria}
            onChange={handleChange("categoria")}
            className={`w-full rounded-[8px] border h-[48px] px-3 font-poppins text-[14px] bg-white focus:outline-none ${
              errors.categoria ? "border-red-500" : "border-[#e5e5e5] focus:border-black"
            }`}
          >
            <option value="">Selecione uma categoria</option>
            <option value="Avisos Administrativos">Avisos Administrativos</option>
            <option value="Bolsas">Bolsas</option>
            <option value="Comunidade">Comunidade</option>
            <option value="Divulgação">Vendas / Serviços</option>
            <option value="Estágios">Estágio / Emprego</option>
            <option value="Eventos">Evento Acadêmico</option>
          </select>
          {errors.categoria && <span className="text-red-500 text-xs font-poppins">{errors.categoria}</span>}
        </div>

        <div className="grid grid-cols-2 gap-[16px]">
          <InputField
            label="Validade da publicação *"
            inputId="expiracao"
            inputType="date" 
            inputValue={formData.expiracao}
            inputOnChange={handleChange("expiracao")}
            errorVar={errors.expiracao}
          />

          <InputField
            label="Contato (Opcional)"
            inputId="telefone"
            inputType="text" 
            inputValue={formData.telefone}
            inputOnChange={handleChange("telefone")}
            inputPlaceholder="(85) 90000-0000"
            errorVar={errors.telefone}
          />
        </div>

        <InputField
          label="Link externo (Opcional)"
          inputId="link"
          inputType="url" 
          inputValue={formData.link}
          inputOnChange={handleChange("link")}
          inputPlaceholder="https://..."
        />

        <InputField
          label="URL da Imagem (Opcional)"
          inputId="imagem"
          inputType="url" 
          inputValue={formData.imagem}
          inputOnChange={handleChange("imagem")}
          inputPlaceholder="Link para imagem de capa"
        />

        <div className="mt-auto pt-[40px] flex flex-col items-center w-full">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex h-[48px] items-center justify-center w-full rounded-[8px] transition-colors cursor-pointer ${
              isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-[#3c4043] hover:bg-black"
            }`}
          >
            <p className="font-poppins font-medium text-[14px] text-white">
              {isSubmitting ? "Publicando..." : "Publicar no Mural"}
            </p>
          </button>
        </div>
      </form>
    </div>
  );
}