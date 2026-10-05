import { pool } from "../database/db.js";

export const buscarPublicacoes = async (req, res) => {
    try {
        const resultado = await pool.query('SELECT p.*, u.nome_usuario FROM publicacoes p INNER JOIN usuarios u ON p.autor_email = u.email')
        
        const publicacoes = resultado.rows

        return res.status(200).json(publicacoes)

    } catch (error) {
        console.log("Erro ao buscar publicações do servidor", error);
        return res.status(500).json({
            error: "Erro ao buscar publicações do servidor."
        })
    }
}

