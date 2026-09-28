import express from "express";
import jwt from "jsonwebtoken";
import { pool } from "../database/db.js";
import * as authController from "../controllers/authControllers.js";
import { compararHash } from "../utils/hashConfig.js";

const router = express.Router();

// Para realizar esses endpoint, foi utilizado como base de estudo a estrutura do projeto do Cadê a Sala?, além de explicações de sintaxe feitas com o auxílio do Gemini

router.post('/cadastrar', authController.cadastrar)

router.get('/ativar-conta', authController.ativarConta)

router.post('/login', authController.login)

export default router;