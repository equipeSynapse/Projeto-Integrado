import express from "express";
import * as notificController from "../controllers/notificacoesControllers.js"
import { authMiddleware } from "../middlewares/authMiddleware.js"

const router = express.Router();

router.get("/", authMiddleware, notificController.obterNotificacoes);
router.patch("/marcar-como-lida", authMiddleware, notificController.marcarComoLida);

export default router;