import express from "express";
import * as notificController from "../controllers/notificacoesControllers.js"
import { authMiddleware } from "../middlewares/authMiddleware.js"

const router = express.Router();

router.get("/notificacoes", authMiddleware, notificController.obterNotificacoes);

export default router;