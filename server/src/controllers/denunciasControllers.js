import { pool } from "../database/db.js";

export const criarDenuncia = async (req, res) => {
    try {
        const { publicacao_id, motivo, descricao } = req.body;
        const email_usuario = req.usuario.email;

        if (!publicacao_id || !motivo) {
            return res.status(400).json({
                dados: { publicacao_id, motivo },
                mensagem: "O ID da publicação e o motivo da denúncia devem ser enviados."
            })
        }

        const { rows } = await pool.query(`INSERT INTO denuncias (usuario_email, publicacao_id, titulo_publicacao, motivo, descricao) 
                                     VALUES ($1, $2::uuid, (SELECT titulo FROM publicacoes WHERE id = $2), $3, $4) RETURNING *;`,
            [email_usuario, publicacao_id, motivo, descricao])

        return res.status(200).json({
            mensagem: "Denúncia criada com sucesso!",
            denuncia: rows[0]
        })


    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({ mensagem: "O usuário só pode enviar uma única denúncia por publicação." })
        }

        if (error.code === '22P02') {
            return res.status(400).json({
                mensagem: "O ID da publicação enviado é inválido. Certifique-se de enviar um UUID correto."
            });
        }

        if (error.code === '23503' || error.code === '23502') {
            return res.status(404).json({ mensagem: "A publicação informada não existe." });
        }

        console.log("Erro ao criar denúncia:", error);
        res.status(500).json({ error: "Erro ao criar denúncia." })
    }
}

export const listarMinhasDenuncias = async (req, res) => {
    try {
        const email_usuario = req.usuario.email;

        const { rows } = await pool.query("SELECT * FROM denuncias WHERE usuario_email = $1 ORDER BY criada_em DESC", [email_usuario]);

        return res.status(200).json({
            denuncias: rows
        })
    } catch (error) {
        console.log("Erro ao buscar histórico de denúncias do usuário:", error);
        return res.status(500).json({error: "Erro ao buscar denúncias"});
    }
}

export const listarTodasDenuncias = async (req, res) => {
    try {
        const { rows } = await pool.query("SELECT * FROM denuncias ORDER BY criada_em DESC");

        return res.status(200).json({
            denuncias: rows
        })
    } catch (error) {
        console.log("Erro ao buscar histórico geral de denúncias:", error);
        return res.status(500).json({error: "Erro ao listar denúncias"});
    }
}

export const atualizarStatusDenuncia = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!id || !id.trim() || !status || !status.trim()) {
            return res.status(400).json({
                mensagem: "O id da denúncia e o novo status devem ser informados."
            })
        }

        const enumStatus = ['PENDENTE', 'APROVADA', 'REJEITADA']
        if (!enumStatus.includes(status.toUpperCase())) {
            return res.status(400).json({
                mensagem: "Status inválido! Utilize 'PENDENTE', 'APROVADA' ou 'REJEITADA'."
            })
        }

        const { rows, rowCount } = await pool.query("UPDATE denuncias SET status = $1 WHERE id = $2::uuid RETURNING *;", [status.toUpperCase(), id])

        if (rowCount === 0) return res.status(404).json({
            mensagem: "Denúncia não encontrada."
        })

        const denuncia = rows[0]

        if (status.toUpperCase() === 'APROVADA') {
            await pool.query("DELETE FROM publicacoes WHERE id = $1;", [denuncia.publicacao_id])
        }

        return res.status(200).json({
            mensagem: "Status de denúncia atualizado!",
            denuncia: rows[0]
        })

    } catch (error) {
        console.log("Erro ao atualizar status de denúncia:", error);
        return res.status(500).json({error: "Erro ao atualizar status de denúncia."})
    }
}