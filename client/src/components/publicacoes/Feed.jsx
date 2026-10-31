import { PubliCard } from "./PubliCard";

export default function Feed( { list } ) {
    return (
        <section className="flex flex-col">
            {list.map((p) => (
                <PubliCard
                    key={p.id}
                    id={p.id}
                    criadoEm={p.criado_em}
                    categoria={p.categoria}
                    imagem={p.imagem ?? null}
                    titulo={p.titulo ?? "Sem Título"}
                    descricao={p.descricao ?? "Sem descrição"}
                    link={p.link}
                    autor={p.nome_usuario}
                    email={p.email}
                    anexo={p.anexo}
                    qtdVisualizacoes={p.qtd_visualizacoes}
                    expiracao={p.expiracao}
                />
            ))}
        </section>
    )
}