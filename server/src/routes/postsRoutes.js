import express from "express";
import * as postsController from "../controllers/postsControllers.js";
import { authMiddleware } from "../middlewares/authMiddleware.js"
import multer from 'multer'

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
})

const router = express.Router();

router.get("/publicacoes", postsController.buscarPublicacoes);
router.patch("/incrementar-visualizacao", postsController.incrementarVisualizacao);

router.post("/criar-publicacao", authMiddleware, upload.fields([{name: 'imagem', maxCount: 1}, {name: 'anexo', maxCount: 1}]), postsController.criarPublicacao);
router.delete("/publicacoes/:id", authMiddleware, postsController.deletarPublicacao);

export default router;