/*Traz a "ponte" (pool) que conecta o servidor ao banco de dados. 
Sem isso, o código não sabe onde os dados estão guardados.*/

import { pool } from "../database/db.js";


export const buscarPublicacoes = async (req, res) => { //Pega os posts para mostrar na tela
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

export const criarPublicacao = async (req, res) => { //Criar um post novo no banco
    try {
        const { titulo, descricao, categoria, imagem, contato, link, validade } = req.body;
        
        // O middleware lê o token do login, descobre quem está executando essa ação e salva em req.usuario
        const autor_email = req.usuario.email;

        /* Validação dos campos obrigatórios -> Se faltar o título, OU a descrição, OU a categoria, 
        OU a validade, o servidor barra e devolve o ERRO 400 */
        if (!titulo?.trim() || !descricao?.trim() || !categoria?.trim() || !validade) {
            return res.status(400).json({
                mensagem: "Os campos obrigatórios (título, descrição, categoria e validade) devem ser preenchidos."
            });
        }

        const query = `
            INSERT INTO publicacoes (autor_email, titulo, descricao, categoria, imagem, contato, link, validade)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
            RETURNING *;
        `; // O uso de values $1, $2... é para previnir ataques, como o SQL Injection.

        const values = [ //É a lista de valores na ordem exata de $1 a $8
            autor_email,
            titulo.trim(),
            descricao.trim(),
            categoria,
            imagem?.trim() || null, //Precisa mudar caso tenha uma imagem padrão para quando o user nn adicionar nada
            contato?.trim() || null,
            link?.trim() || null,
            validade
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
