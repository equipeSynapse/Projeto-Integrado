import { pool } from "../database/db.js";

export const obterNotificacoes = async (req, res) => {
    try {
        const email_usuario = req.usuario.email;

        const query = `SELECT n.id, n.tipo, n.gerada_em, nu.lida, p.titulo AS titulo_publicacao
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