import express from "express";
import * as notificController from "../controllers/notificacoesControllers.js"
import { authMiddleware } from "../middlewares/authMiddleware.js"

const router = express.Router();

router.get("/", authMiddleware, notificController.obterNotificacoes);
router.patch("/marcar-como-lida", authMiddleware, notificController.marcarComoLida);
router.patch("/marcar-todas-como-lidas", authMiddleware, notificController.marcarTodasComoLidas);
router.delete("/excluir-notificacao", authMiddleware, notificController.excluirNotificacao);

export default router;