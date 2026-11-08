import UserService from "../services/userServices.js";
import jwt from "jsonwebtoken";
import {v4 as uuidv4} from "uuid";
import { enviarEmailConfirmacao } from "../services/enviarEmailConfirmacao.js";
import { compararHash, gerarHash } from "../utils/hashConfig.js";
import { pool } from "../database/db.js";
import { enviarEmailRedefinirSenha } from "../services/enviarEmailRedefinirSenha.js";

export const cadastrar = async (req, res) => {
    try {
        const { email, nome_completo, nome_usuario, senha } = req.body;

        if (
            !nome_completo || !nome_usuario || !email || !senha ||
            !nome_completo.trim() || !nome_usuario.trim() || !email.trim() || !senha.trim()
        ) {
            return res.status(400).json({
                mensagem: 'Todos os campos (nome completo, nome de usuário, email e senha) devem estar devidamente preenchidos.'
            });
        }

        const emailRegexUFC = /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9.-]+\.)?ufc\.br$/i;
        if (!emailRegexUFC.test(email.trim())) {
            return res.status(400).json({
                mensagem: 'O e-mail informado não é do domínio da UFC. Por favor, informe seu e-mail institucional.'
            });
        }

        const tokenAtivacao = { "token": uuidv4(), "timestamp": Date.now() };

        const user = await UserService.createUser(
            email.trim(),
            nome_completo.trim(),
            nome_usuario.trim().toLowerCase(),
            senha,
            tokenAtivacao
        );

        await enviarEmailConfirmacao(email.trim(), tokenAtivacao["token"])

        return res.status(201).json({
            mensagem: 'Usuário criado com sucesso.',
            usuario: {
                email: user.email,
                nome_completo: user.nome_completo,
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

export const verificarNomeUsuario = async (req, res) => {
    try {
        const { nome_usuario } = req.body;

        const buscaNome = await pool.query('SELECT EXISTS (SELECT 1 FROM usuarios WHERE nome_usuario = $1)', [nome_usuario.toLowerCase()]);

        const usuarioExiste = buscaNome.rows[0].exists;

        return res.status(200).json({usuarioExiste});
    } catch (error) {
        console.log("Erro ao verificar se nome de usuário existe:", error);
        return res.status(500).json({
            mensagem: "Erro ao verificar se nome de usuário existe."
        })
    }
}

export const ativarConta = async (req, res) => {
    try {
        const { token } = req.query;

        if (!token) {
            return res.status(400).json({ mensagem: "Token de Ativação Ausente!" })
        }

        const resultado = await pool.query('SELECT email, token FROM usuarios WHERE token->>\'token\' = $1', [token]);

        if (resultado.rows.length === 0) {
            return res.status(400).json({ mensagem: "Token de Ativação Inválido ou Conta já Ativada!" })
        }

        if ((Date.now() - resultado.rows[0].token["timestamp"])/(1000 * 60) > 10 ) {
            return res.status(401).json( {mensagem: "Token de Ativação Expirado!"})
        }

        await pool.query('UPDATE usuarios SET ativo = true, token = NULL WHERE email = $1', [resultado.rows[0].email]);

        return res.status(200).json({ mensagem: "Conta Ativada com Sucesso! Seu login já está autorizado!" })
    } catch (error) {
        console.log("Erro ao ativar conta:", error);
        return res.status(500).json({
            mensagem: "Erro ao ativar conta do usuário."
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

        const token = jwt.sign(
            {"email":resultado.rows[0].email, 
             "usuario":resultado.rows[0].nome_usuario,
             "nome": resultado.rows[0].nome_completo, 
             "bio": resultado.rows[0].bio
            }, process.env.JWT_SECRET, {expiresIn: "30m"})

        return res.status(200).json({ "mensagem": "Login efetuado com sucesso!", "token": token, "usuario": {"email":email, "nome completo": resultado.rows[0].nome_completo}})
        
    } catch (error) {
        console.log("Erro ao efetuar login:", error);
        return res.status(500).json({
            mensagem: "Erro interno no servidor. Tente efetuar o login novamente mais tarde."
        })
    }
}

export const esqueciSenha = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email || !email.trim()) {
            return res.status(400).json({mensagem: 'O email deve ser informado para a redefinição de senha.'})
        }

        const buscaEmail = await pool.query('SELECT EXISTS (SELECT 1 FROM usuarios WHERE email = $1)', [email]);

        if (!buscaEmail.rows[0].exists) return res.status(400).json({mensagem: "O email informado não consta no banco de dados. Realize um cadastro."}) 

        const tokenRedefinicao = { "token": uuidv4(), "timestamp": Date.now() };

        await pool.query('UPDATE usuarios SET token = $1 WHERE email = $2', [tokenRedefinicao, email])

        try {
            await enviarEmailRedefinirSenha(email, tokenRedefinicao["token"]);
        } catch (error) {
            return res.status(500).json({mensagem: 'Erro ao enviar e-mail!'})
        }

        return res.status(200).json({
            mensagem: 'E-mail para redefinição de senha enviado com sucesso!'
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            mensagem: 'Erro interno no servidor. Tente novamente mais tarde.'
        });
    }
}

export const validarToken = async (req, res) => {
    try {
        const { token } = req.query;

        if (!token || !token.trim()) return res.status(400).json({mensagem: "Token de Redefinição Ausente!"})

        const resultado = await pool.query('SELECT * FROM usuarios WHERE token->>\'token\' = $1', [token])

        if (resultado.rows.length === 0) return res.status(400).json({mensagem: "Token de Redefinição Inválido!"})

        if ((Date.now() - resultado.rows[0].token["timestamp"])/(1000 * 60) > 10 ) {
            return res.status(401).json( {mensagem: "Token de Redefinição Expirado!", email: resultado.rows[0].email})
        }

        return res.status(200).json({email: resultado.rows[0].email})
    } catch (error) {
        console.log("Erro ao validar token:", error);
        return res.status(500).json({
            mensagem: "Erro interno no servidor. Tente novamente mais tarde."
        })
    }
}

export const redefinirSenha = async (req, res) => {
    try {
        const { token } = req.query;
        const { senha } = req.body;

        if (!token || !token.trim()) return res.status(400).json({mensagem: "Token de Redefinição Ausente!"})

        if (!senha || !senha.trim()) return res.status(400).json({mensagem: "É necessário informar uma nova senha."})

        const resultado = await pool.query('SELECT token, email FROM usuarios WHERE token->>\'token\' = $1', [token])

        if (resultado.rows.length === 0) return res.status(400).json({mensagem: "Token de Redefinição Inválido!"})

        if ((Date.now() - resultado.rows[0].token["timestamp"])/(1000 * 60) > 10 ) {
            return res.status(401).json( {mensagem: "Token de Redefinição Expirado!", email: resultado.rows[0].email})
        }

        await pool.query('UPDATE usuarios SET token = NULL, senha = $1 WHERE token->>\'token\' = $2', [await gerarHash(senha), resultado.rows[0].token["token"]])

        return res.status(200).json({mensagem: `Senha Alterada!`})

    } catch (error) {
        console.log("Erro ao redefinir senha:", error);
        return res.status(500).json({
            mensagem: "Erro interno no servidor. Tente redefinir a senha novamente mais tarde."
        })
    }
}

export const atualizarPerfil = async (req, res) => {
    try {
        const email = req.usuario.email;
        const { nome_completo, nome_usuario, bio, senhaAtual, senhaNova } = req.body;

        if (!nome_completo?.trim() || !nome_usuario?.trim()) {
            return res.status(400).json({ mensagem: 'Nome completo e nome de usuário são obrigatórios.' });
        }

        const buscaUsuario = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        if (buscaUsuario.rowCount === 0) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
        }
        const usuarioAtual = buscaUsuario.rows[0];

        if (nome_usuario.trim().toLowerCase() !== usuarioAtual.nome_usuario) {
            const buscaNome = await pool.query(
                'SELECT EXISTS (SELECT 1 FROM usuarios WHERE nome_usuario = $1 AND email != $2)',
                [nome_usuario.trim().toLowerCase(), email]
            );
            if (buscaNome.rows[0].exists) {
                return res.status(409).json({ mensagem: 'Este nome de usuário já está em uso.' });
            }
        }

        let query = 'UPDATE usuarios SET nome_completo = $1, nome_usuario = $2, bio = $3';
        let values = [nome_completo.trim(), nome_usuario.trim().toLowerCase(), bio?.trim() || null];

        if (senhaNova?.trim()) {
            if (!senhaAtual?.trim() || !(await compararHash(senhaAtual, usuarioAtual.senha))) {
                return res.status(401).json({ mensagem: 'A senha atual informada está incorreta.' });
            }
            const senhaHash = await gerarHash(senhaNova);
            query += ', senha = $4 WHERE email = $5 RETURNING *';
            values.push(senhaHash, email);
        } else {
            query += ' WHERE email = $4 RETURNING *';
            values.push(email);
        }

        const resultado = await pool.query(query, values);
        const userAtualizado = resultado.rows[0];

        const token = jwt.sign(
            {
                "email": userAtualizado.email,
                "usuario": userAtualizado.nome_usuario,
                "nome": userAtualizado.nome_completo,
                "bio": userAtualizado.bio
            },
            process.env.JWT_SECRET,
            { expiresIn: "30m" }
        );

        return res.status(200).json({
            mensagem: "Perfil atualizado com sucesso!",
            token: token
        });

    } catch (error) {
        console.log("Erro ao atualizar perfil:", error);
        return res.status(500).json({ mensagem: "Erro ao atualizar o perfil." });
    }
}

export const excluirConta = async (req, res) => {
    try {
        const email = req.usuario.email;
        const {usuario, senha} = req.body;

        if (!usuario || !usuario.trim() || !senha || !senha.trim()) {
            return res.status(400).json({mensagem: "É necessário informar nome de usuário e senha!"});
        }

        const {rows} = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);

        if (rows[0].nome_usuario != usuario || !await compararHash(senha, rows[0].senha)) {
            return res.status(401).json({mensagem: `Dados inválidos para realizar a exclusão!`})
        }

        const resultado = await pool.query('DELETE FROM usuarios WHERE email = $1 RETURNING *', [email]);

        if (resultado.rowCount === 0) {
            return res.status(404).json({ mensagem: "Conta não encontrada." });
        }

        return res.status(200).json({ mensagem: "Conta excluída com sucesso!" });

    } catch (error) {
        console.log("Erro ao excluir conta:", error);
        return res.status(500).json({ mensagem: "Erro interno ao excluir a conta." });
    }
}