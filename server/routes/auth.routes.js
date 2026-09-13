import express from "express";
import { pool } from "../database/db.js";
import { v4 as uuidv4 } from "uuid";
import { enviarEmailConfirmacao } from "../services/enviarEmail.js";

const router = express.Router();

// Para realizar esses endpoint, foi utilizado como base de estudo a estrutura do projeto do Cadê a Sala?, além de explicações de sintaxe feitas com o auxílio do Gemini

// router.post('/cadastrar', async (req, res) => {
//     const { nomeCompleto, nomeUsuario, email, senha } = req.body;

//     const tokenAtivacao = uuidv4();

//     pool.query(`INSERT INTO usuarios(email, nome_completo, nome_usuario, senha, token_ativacao) VALUES ($1, $2, $3, $4, $5) returning email`, [email, nomeCompleto, nomeUsuario, senha, tokenAtivacao])

//     await enviarEmailConfirmacao(email, tokenAtivacao);

//     return res.status(201).json("Valor Inserido no BD!")
// })


router.get('/ativar-conta', async (req, res) => {
    try {
        const { token } = req.query; 

        if (!token) {
            return res.status(400).json({mensagem: "Token de Ativação Ausente!"})
        }

        const resultado = await pool.query('SELECT email FROM usuarios WHERE token_ativacao = $1', [token]);

        if (resultado.rows.length === 0) {
            return res.status(400).json({ mensagem: "Token de Ativação Inválido ou Conta já Ativada!" })
        }

        await pool.query('UPDATE usuarios SET ativo = true, token_ativacao = NULL WHERE email = $1', [resultado.rows[0].email]);

        return res.status(200).json({ mensagem: "Conta Ativada com Sucesso! Seu login já está autorizado!" })
    } catch (error) {
        console.log("Erro ao ativar conta:", error);
        return res.status(500).json({
            error: "Erro ao ativar conta do usuário."
        })
    }
})

export default router;