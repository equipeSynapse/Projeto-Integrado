import { pool } from "../database/db.js";

export const seguirCategoria = async(req, res) => {
    try {
        const email = req.usuario.email;
        const { categoria } = req.body;

        if (!email || !email.trim() || !categoria || !categoria.trim()) {
            return res.status(400).json({mensagem: "É necessário informar o email e a categoria."})
        }

        await pool.query('INSERT INTO usuarios_categorias (email_usuario, categoria) VALUES ($1, $2) ON CONFLICT DO NOTHING', [email, categoria])

        return res.status(200).json({mensagem: "Categoria seguida com sucesso!"})
    } catch (error) {
        console.log("Erro ao seguir categoria:", error)
        return res.status(500).json({
            error: "Erro ao seguir categoria."
        })
    }
}



export const desseguirCategoria = async(req, res) => {
    try {
        const email = req.usuario.email;
        const { categoria } = req.body;

        if (!email || !email.trim() || !categoria || !categoria.trim()) {
            return res.status(400).json({mensagem: "É necessário informar o email e a categoria."})
        }

        await pool.query('DELETE FROM usuarios_categorias WHERE email_usuario = $1 AND categoria = $2', [email, categoria])

        return res.status(200).json({mensagem: "Categoria desseguida com sucesso!"})
    } catch (error) {
        console.log("Erro ao desseguir categoria:", error)
        return res.status(500).json({
            error: "Erro ao desseguir categoria."
        })
    }
}


export const obterCategoriasSeguidas = async(req, res) => {
    try {
        const { usuario } = req.query;

        if (!usuario || !usuario.trim()) return res.status(400).json({mensagem: "É necessário informar o usuário."})

        const { rows } = await pool.query('SELECT uc.categoria FROM usuarios_categorias uc INNER JOIN usuarios u ON u.email = uc.email_usuario WHERE u.nome_usuario = $1', [usuario]);

        return res.status(200).json({"categorias": rows.map(r => r.categoria)})

    } catch (error) {
        console.log("Erro ao obter categorias seguidas:", error);
        return res.status(500).json({
            error: "Erro ao obter categorias seguidas"
        })
    }
}