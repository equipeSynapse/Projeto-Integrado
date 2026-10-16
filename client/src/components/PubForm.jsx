import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import closeIcon from "../assets/icons/close.svg";
import { InputField } from "./InputField";
import { loginUsuario } from "../services/login";

export default function PubForm() {
  const navigate = useNavigate(); // Redirecionar página
  //Criando Form com id, criado_em,autor_email, titulo, descricao, categoria, imagem, contato, link, validade, qtd_visualizacoes
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    categoria: "",
    imagem: "",
    contato: "",
    link: "",
    validade: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(""); 


  const formatarTelefone = (valor) => {
    // Remove tudo que não for número
    let numero = valor.replace(/\D/g, "");
    
    // Limita a 11 números (DDD + 9 dígitos)
    numero = numero.substring(0, 11);

    // Aplica (XX) XXXXX-XXXX
    if (numero.length > 2) {
      numero = `(${numero.substring(0, 2)}) ${numero.substring(2)}`;
    }
    if (numero.length > 10) {
      numero = `${numero.substring(0, 10)}-${numero.substring(10)}`;
    }
    
    return numero;
  };
  
 function handleChange(field) {
    return (event) => {
      let valorInput = event.target.value;

     
      if (field === "contato") {
        valorInput = formatarTelefone(valorInput);
      }

      setFormData((prev) => ({ ...prev, [field]: valorInput }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
      setServerError(""); 
    };
  }

  // Função de submissão do form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const nextErrors = {};
    
    // Validações de campos obrigatórios
    if (!formData.titulo.trim()) nextErrors.titulo = "O título é obrigatório";
    if (!formData.descricao.trim()) nextErrors.descricao = "Insira uma descrição";
    if (!formData.categoria) nextErrors.categoria = "Selecione uma categoria";
    if (!formData.validade) nextErrors.validade = "Defina uma data de validade";

    // Validação do campo contato (se o usuário tiver digitado algo)
    if (formData.contato) {
      // Pega apenas os números para verificar a quantidade
      const apenasNumeros = formData.contato.replace(/\D/g, "");
      if (apenasNumeros.length < 11) {
        nextErrors.contato = "Insira o número completo com DDD";
      }
    }

setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      try {
        const response = await criarPublicacao(formData);
        console.log("Publicação criada com sucesso", formData);
        
        // Redireciona de volta para o mural após a criação
        navigate("/mural"); 

      } catch (error) {
        setServerError("Erro ao criar publicação. Tente novamente mais tarde.");
      }
    }
  }

  return ( //Front End Provisório (gerado por IA), aguardando o protótipo.
    <div className="bg-white border border-[#e5e5e5] border-solid min-h-[550px] relative rounded-[16px] w-full max-w-[600px] p-[31px] flex flex-col mx-auto my-8">
      
      <button 
        type="button" 
        onClick={() => navigate(-1)} // Volta para a página anterior
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

        {/* Para a descrição, o ideal é um Textarea. Se o seu InputField não suportar multiline, você pode usar uma tag nativa estilizada com suas classes */}
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

        {/* Categoria usando um Select nativo */}
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
            <option value="estagio">Estágio / Emprego</option>
            <option value="evento">Evento Acadêmico</option>
            <option value="projeto">Projeto de Extensão</option>
            <option value="vendas">Vendas / Serviços</option>
          </select>
          {errors.categoria && <span className="text-red-500 text-xs font-poppins">{errors.categoria}</span>}
        </div>

        <div className="grid grid-cols-2 gap-[16px]">
          <InputField
            label="Validade da publicação *"
            inputId="validade"
            inputType="date" 
            inputValue={formData.validade}
            inputOnChange={handleChange("validade")}
            errorVar={errors.validade}
          />

          <InputField
            label="Contato (Opcional)"
            inputId="contato"
            inputType="text" 
            inputValue={formData.contato}
            inputOnChange={handleChange("contato")}
            inputPlaceholder="(85) 90000-0000"
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
            className="flex h-[48px] items-center justify-center w-full rounded-[8px] bg-[#3c4043] hover:bg-black transition-colors cursor-pointer"
          >
            <p className="font-poppins font-medium text-[14px] text-white">
              Publicar no Mural
            </p>
          </button>
        </div>
      </form>
    </div>
  );
}