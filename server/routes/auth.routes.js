import express from "express";
import { pool } from "../database/db.js";
import { v4 as uuidv4 } from "uuid";
import { enviarEmailConfirmacao } from "../services/enviarEmail.js";

const router = express.Router();

router.post('/cadastrar', async (req, res) => {
    const {nome, email, senha} = req.body;

    const tokenAtivacao = uuidv4();

    pool.query(`INSERT INTO usuarios(email, nome, senha, token_ativacao) VALUES ($1, $2, $3, $4) returning email`, [email, nome, senha, tokenAtivacao])

    await enviarEmailConfirmacao();

    return res.status(201).json("Valor Inserido no BD!")
})

export default router;