import express from "express";
import * as authController from "../controllers/auth.controllers.js";

const router = express.Router();

router.post('/cadastrar', authController.cadastrar)

router.get('/ativar-conta', authController.ativarConta)

router.post('/login', authController.login)

export default router;