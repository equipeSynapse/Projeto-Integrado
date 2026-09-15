const UserService = require('../services/UserServices');

exports.create = async (req, res) => {
    try {
        const { email, nome, senha } = req.body;
        await UserService.createUser(email, nome, senha);
        res.status(201).json({ message: 'Usuário criado com sucesso.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar usuário.' });
    }
};