import { pool } from "../database/db.js";

export const buscarPublicacoes = async (req, res) => {
    try {
        const resultado = await pool.query('SELECT p.*, u.nome_usuario FROM publicacoes p INNER JOIN usuarios u ON p.autor_email = u.email ORDER BY criado_em DESC')
        
        const publicacoes = resultado.rows

        return res.status(200).json(publicacoes)

    } catch (error) {
        console.log("Erro ao buscar publicações do servidor", error);
        return res.status(500).json({
            error: "Erro ao buscar publicações do servidor."
        })
    }
}

export const incrementarVisualizacao = async (req, res) => {
    try {
        const { id } = req.body;

        pool.query('UPDATE publicacoes SET qtd_visualizacoes = qtd_visualizacoes + 1 WHERE id = $1', [id])

        return res.status(200).json({mensagem: "Quantidade de visualizações de publicação Atualizada."});
    } catch (error) {
        console.log("Erro ao atualizar número de visualizações de postagem", error);
        return res.status(500).json({
            error: "Erro ao atualizar número de visualizações de postagem."
        })
    }
}

