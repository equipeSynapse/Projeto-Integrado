import { useState, useEffect } from "react";
import { PubliCard } from "../../components/publicacoes/PubliCard";
import { getPublicacoes } from "../../services/publicacoes";
import Header from "../../components/Header";
import { InputSearch } from "../../components/publicacoes/InputSearch";
import Button from "../../components/Button";
import calendarIcon from "../../assets/icons/calendar.png";

export default function HomePage() {
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

  const termo = busca.toLowerCase().replace(/^@/, "");
  const filtradas = publicacoes.filter(
    (p) =>
      p.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      (p.nome_usuario ?? "").toLowerCase().includes(termo)
  );

  return (
    <div className="min-h-screen bg-white">
        <Header>
            <div className="flex items-center gap-6 w-full">
                <div> Logo </div>
                <InputSearch onKeyDown={(e) => {if (e.key === 'Enter') setBusca(e.target.value)}} />

                <Button variant="second">
                    <img src={calendarIcon} className="size-[18px]" />
                    <span> Período </span>
                </Button>
            </div>

            <div className="flex justify-between gap-12 text-nowrap">
                <div className="flex gap-6">
                    <div> Início </div>
                    <div> Notificações </div>
                </div>
                <div className="flex justify-between gap-[24px] items-center">
                    <Button variant="text"> Entre </Button>
                    <Button variant="cta">
                        <span> Cadastre-se </span>
                    </Button>
                </div>
            </div>
        </Header>

        <main className="flex flex-col gap-[24px] px-[31px] py-[32px] max-w-[960px] mx-auto">
            {filtradas.map((p) => (
                <PubliCard 
                    key={p.id} 
                    id={p.id}
                    criadoEm={p.criado_em}
                    categoria={p.categoria}
                    imagem={p.imagem ?? null} 
                    titulo={p.titulo ?? "Sem Título"} 
                    descricao={p.descricao ?? "Sem descrição"} 
                    autor={p.nome_usuario} 
                    email={p.email}
                    qtdVisualizacoes={p.qtd_visualizacoes}
                    expiracao={p.expiracao}
                />
            ))}
        </main>
    </div>
  );
}