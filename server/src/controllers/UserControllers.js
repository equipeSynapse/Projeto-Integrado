const { json } = require('express');
const UserService = require('../services/UserServices');

exports.create = async (req, res) => {
    try {
        const { email, nome_completo, username, senha } = req.body;

        if (
            !nome_completo || !username || !email || !senha ||
            !nome_completo.trim() || !username.trim() || !email.trim() || !senha.trim()
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

        const user = await UserService.createUser(
            email.trim(),
            nome_completo.trim(),
            username.trim().toLowerCase(),
            senha
        );

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
};