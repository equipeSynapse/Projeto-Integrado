import { useState, useEffect } from "react";
import { InputSearch } from "../../components/publicacoes/InputSearch";
import { PubliCard } from "../../components/publicacoes/PubliCard";
import { getPublicacoes } from "../../services/publicacoes";


export function PublicacoesPage() {
    const [busca, setBusca] = useState("");
    const [publicacoes, setPublicacoes] = useState([]);
    
    useEffect(() => {
      const fetchPublicacoes = async () => {
        try {
          const data = await getPublicacoes();
          setPublicacoes(data);
        } catch (error) {
          console.error("Erro ao buscar publicações:", error);
        }
      };
        fetchPublicacoes();
    }, []);

  const filtradas = publicacoes.filter((p) =>
    p.titulo.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      <header className="flex justify-center px-[31px] py-[16px] border-b border-[#e5e5e5] border-solid">
        <InputSearch value={busca} onChange={(e) => setBusca(e.target.value)} />
      </header>

      <main className="flex flex-col gap-[24px] px-[31px] py-[32px] max-w-[960px] mx-auto">
        {filtradas.map((p) => (
          <PubliCard key={p.id} imagem={p.imagem ?? null} titulo={p.titulo ?? "Sem Título"} descricao={p.descricao ?? "Sem descrição"} />
        ))}
      </main>
    </div>
  );
}
