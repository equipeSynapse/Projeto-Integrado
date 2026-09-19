import UserService from "../services/user.services.js";
import {v4 as uuidv4} from "uuid";
import { enviarEmailConfirmacao } from "../services/enviarEmail.js";

export const cadastrar = async (req, res) => {
    try {
        const { email, nomeCompleto, nomeUsuario, senha } = req.body;

        if (
            !nomeCompleto || !nomeUsuario || !email || !senha ||
            !nomeCompleto.trim() || !nomeUsuario.trim() || !email.trim() || !senha.trim()
        ) {
            return res.status(400).json({
                mensagem: 'Todos os campos (nome completo, nome de usuário, email e senha) devem estar devidamente preenchidos.'
            });
        }

        const emailRegexUFC = /^[a-zA-Z0-9._%+-]+@(alu\.)?ufc\.br$/i;
        if (!emailRegexUFC.test(email.trim())) {
            return res.status(400).json({
                mensagem: 'O e-mail informado não é do domínio da UFC. Por favor, informe seu e-mail institucional.'
            });
        }

        const tokenAtivacao = uuidv4();

        const user = await UserService.createUser(
            email.trim(),
            nomeCompleto.trim(),
            nomeUsuario.trim().toLowerCase(),
            senha,
            tokenAtivacao
        );

        //await enviarEmailConfirmacao(email, tokenAtivacao);

        return res.status(201).json({
            mensagem: 'Usuário criado com sucesso.',
            usuario: {
                email: user.email,
                nome_completo: user.nomeCompleto,
            }
        });
    } catch (error) {
        if (error.code === '23505' || error.status === 409) {
            return res.status(409).json({
                mensagem: 'O email ou nome de usuário informado já se encontra registrado no sistema.'
            });
        }

        console.error(error);
        return res.status(500).json({
            mensagem: 'Erro interno no servidor. Tente novamente mais tarde.'
        });
    }
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
        if (!email || !senha || !email.trim() || !senha.trim()) {
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