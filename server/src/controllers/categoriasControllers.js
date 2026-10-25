import { pool } from "../database/db.js";

export const seguirCategoria = async(req, res) => {
    try {
        const { usuario, categoria } = req.body;

        if (!usuario || !usuario.trim() || !categoria || !categoria.trim()) {
            return res.status(400).json({mensagem: "É necessário informar o usuário e a categoria."})
        }

        const categoriaJaSeguida = await pool.query('SELECT 1 FROM usuarios WHERE nome_usuario = $1 AND $2 = ANY(categorias_seguidas)', [usuario, categoria])

        if (categoriaJaSeguida.rowCount > 0) {
            return res.status(409).json({mensagem: "O usuário já segue a categoria informada."})
        }

        await pool.query('UPDATE usuarios SET categorias_seguidas = array_append(categorias_seguidas, $1) WHERE nome_usuario = $2', [categoria, usuario])

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
        const { usuario, categoria } = req.body;

        if (!usuario || !usuario.trim() || !categoria || !categoria.trim()) {
            return res.status(400).json({mensagem: "É necessário informar o usuário e a categoria."})
        }

        const categoriaSeguida = await pool.query('SELECT 1 FROM usuarios WHERE nome_usuario = $1 AND $2 = ANY(categorias_seguidas)', [usuario, categoria])

        if (categoriaSeguida.rowCount === 0) {
            return res.status(409).json({mensagem: "O usuário não segue a categoria informada."})
        }

        await pool.query('UPDATE usuarios SET categorias_seguidas = array_remove(categorias_seguidas, $1) WHERE nome_usuario = $2', [categoria, usuario])

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

        const busca = await pool.query('SELECT categorias_seguidas FROM usuarios WHERE nome_usuario = $1', [usuario]);

        return res.status(200).json({"categorias": busca.rows[0].categorias_seguidas})

    } catch (error) {
        console.log("Erro ao obter categorias seguidas:", error);
        return res.status(500).json({
            error: "Erro ao obter categorias seguidas"
        })
    }
}