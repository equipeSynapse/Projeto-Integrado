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

export const criarPublicacao = async (req, res) => { 
    try {
        const { titulo, descricao, categoria, imagem, email, telefone, link, anexos, expiracao } = req.body;
        
        // O middleware lê o token do login, descobre quem está executando essa ação e salva em req.usuario
        const autor_email = req.usuario.email;

        /* Validação dos campos obrigatórios -> Se faltar o título, OU a descrição, OU a categoria, 
        OU a validade, o servidor barra e devolve o ERRO 400 */
        if (!titulo?.trim() || !descricao?.trim() || !categoria?.trim() || !expiracao) {
            return res.status(400).json({
                dados: {titulo, descricao, categoria, expiracao},
                mensagem: "Os campos obrigatórios (título, descrição, categoria e expiração) devem ser preenchidos."
            });
        }

        const query = `
            INSERT INTO publicacoes (autor_email, titulo, descricao, categoria, imagem, email, telefone, link, anexos, expiracao)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
            RETURNING *;
        `; 

        const values = [ 
            autor_email,
            titulo.trim(),
            descricao.trim(),
            categoria,
            imagem?.trim() || null, 
            email?.trim() || null,
            telefone?.trim() || null,
            link?.trim() || null,
            anexos?.trim() || null,
            expiracao
        ];

        const resultado = await pool.query(query, values);

        return res.status(201).json({
            mensagem: "Publicação criada com sucesso!",
            publicacao: resultado.rows[0]
        });

    } catch (error) {
        console.log("Erro ao criar publicação:", error);
        return res.status(500).json({
            error: "Erro interno ao criar a publicação no servidor."
        });
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

