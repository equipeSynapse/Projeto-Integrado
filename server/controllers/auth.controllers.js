import jwt from "jsonwebtoken";
import { pool } from "../database/db.js";
import { v4 as uuidv4 } from "uuid";
import { enviarEmailConfirmacao } from "../services/enviarEmail.js";
import { compararHash } from "../utils/hashConfig.js";


export const cadastrar = async (req, res) => {
    const { nomeCompleto, nomeUsuario, email, senha } = req.body;

    const tokenAtivacao = uuidv4();

    pool.query(`INSERT INTO usuarios(email, nome_completo, nome_usuario, senha, token_ativacao) VALUES ($1, $2, $3, $4, $5) returning email`, [email, nomeCompleto, nomeUsuario, senha, tokenAtivacao])

    //await enviarEmailConfirmacao(email, tokenAtivacao);

    return res.status(201).json("Valor Inserido no BD!")
}


export const ativarConta = async (req, res) => {
    try {
        const { token } = req.query;

        if (!token) {
            return res.status(400).json({ mensagem: "Token de Ativação Ausente!" })
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
}


export const login = async (req, res) => {
    try {
        const { email, senha } = req.body;

        //Caso para quando o usuário não preenche uma informação
        if (!email || !senha) {
            return res.status(400).json({ "mensagem": "Todos os campos (email e senha) devem ser devidamente preenchidos." })
        }

        //Procura os dados no banco conforme o que foi passado na requisição
        const resultado = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);

        //Situação caso o banco não ache nada que bata com as informações passadas
        if (resultado.rows.length === 0) return res.status(401).json({ "mensagem": "Login e/ou senha incorretos." });

        //Verifica se a senha do usuário informado está de acordo
        if (!(await compararHash(senha, resultado.rows[0].senha))) return res.status(401).json({ "mensagem": "Login e/ou senha incorretos." });

        //Verifica se o usuário selecionado tem conta ativa
        if (resultado.rows[0].ativo !== true) return res.status(409).json({"mensagem": "Essa conta ainda não foi ativada. Verifique seu e-mail."})

        const token = jwt.sign({"email":resultado.rows[0].email}, process.env.JWT_SECRET, {expiresIn: "1m"})

        return res.status(200).json({ "mensagem": "Login efetuado com sucesso!", "token": token, "usuario": {"email":email, "nome completo": resultado.rows[0].nome_completo}})
        
    } catch (error) {
        console.log("Erro ao efetuar login:", error);
        return res.status(500).json({
            "mensagem": "Erro interno no servidor. Tente efetuar o login novamente mais tarde."
        })
    }
}