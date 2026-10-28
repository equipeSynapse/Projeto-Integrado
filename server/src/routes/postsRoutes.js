import express from "express";
import * as postsController from "../controllers/postsControllers.js";
import { authMiddleware } from "../middlewares/authMiddleware.js"

const router = express.Router();

router.get("/publicacoes", postsController.buscarPublicacoes);

//Nova rota protegida: Apenas usuários logados criem publicações
router.post("/publicacoes", authMiddleware, postsController.criarPublicacao);
router.patch("/incrementar-visualizacao", postsController.incrementarVisualizacao);

router.post("/criar-publicacao", authMiddleware, postsController.criarPublicacao);
router.delete("/publicacoes/:id", authMiddleware, postsController.deletarPublicacao);


export default router;