import { pool } from "../database/db.js";

export const obterNotificacoes = async (req, res) => {
    try {
        const email_usuario = req.usuario.email;

        const query = `SELECT n.id, n.tipo, n.gerada_em, nu.lida, n.publicacao_id, p.titulo AS titulo_publicacao
                 FROM notificacoes_usuarios nu 
                 INNER JOIN notificacoes n ON n.id = nu.notificacao_id 
                 LEFT JOIN publicacoes p ON p.id = n.publicacao_id 
                 WHERE nu.usuario_email = $1
                 ORDER BY n.gerada_em DESC`

        const { rows } = await pool.query(query, [email_usuario])

        return res.status(200).json({notificacoes: rows})

    } catch (error) {
        console.log("Erro ao buscar as notificações no servidor", error);
        return res.status(500).json({
            error: "Erro ao buscar as notificações no servidor."
        })
    }
}

export const marcarComoLida = async (req, res) => {
    try {
        const { notificacao_id } = req.body;

        if (!notificacao_id || !notificacao_id.trim()) {
            return res.status(400).json({mensagem: "É necessário informar o ID da notificação."})
        }

        const email_usuario = req.usuario.email;

        const { rows } = await pool.query('UPDATE notificacoes_usuarios SET lida = TRUE WHERE usuario_email = $1 AND notificacao_id = $2', [email_usuario, notificacao_id])

        return res.status(200).json({mensagem: "O status de leitura de notificação foi marcado como lido!"})
    } catch (error) {
        console.log("Erro ao atualizar status de leitura de notificação", error);
        return res.status(500).json({
            error: "Erro ao atualizar status de leitura de notificação."
        })
    }
}

export const marcarTodasComoLidas = async (req, res) => {
    try {
        const email_usuario = req.usuario.email;

        const { rows } = await pool.query('UPDATE notificacoes_usuarios SET lida = TRUE WHERE usuario_email = $1', [email_usuario])

        return res.status(200).json({mensagem: "Os status de leitura de todas as notificações foram marcados como lido!"})
    } catch (error) {
        console.log("Erro ao atualizar status de leitura das notificações", error);
        return res.status(500).json({
            error: "Erro ao atualizar status de leitura das notificações."
        })
    }
}

export const excluirNotificacao = async(req, res) => {
    try {
        const { notificacao_id } = req.body;

        if (!notificacao_id || !notificacao_id.trim()) {
            return res.status(400).json({mensagem: "É necessário informar o ID da notificação."})
        }

        const email = req.usuario.email;

        await pool.query('DELETE FROM notificacoes_usuarios WHERE usuario_email = $1 AND notificacao_id = $2', [email, notificacao_id])

        return res.status(200).json({mensagem: "Notificação excluída com sucesso!"})
    } catch (error) {
        console.log("Erro ao excluir notificação:", error)
        return res.status(500).json({
            error: "Erro ao excluir notificação."
        })
    }
}