import express from "express";
import * as postsController from "../controllers/postsControllers.js"
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/publicacoes", postsController.buscarPublicacoes);
router.patch("/incrementar-visualizacao", postsController.incrementarVisualizacao);

//Nova rota protegida: Apenas usuários logados criem publicações
router.post("/publicacoes", authMiddleware, postsController.criarPublicacao);

export default router;