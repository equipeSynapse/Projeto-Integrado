import { pool } from "../database/db.js";

export const buscarPublicacoes = async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM publicacoes')
        
        const publicacoes = resultado.rows

        return res.status(200).json(publicacoes)

    } catch (error) {
        console.log("Erro ao buscar publicações do servidor", error);
        return res.status(500).json({
            error: "Erro ao buscar publicações do servidor."
        })
    }
}

