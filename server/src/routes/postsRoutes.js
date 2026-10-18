import express from "express";
import * as postsController from "../controllers/postsControllers.js"

const router = express.Router();

router.get("/publicacoes", postsController.buscarPublicacoes);
router.patch("/incrementar-visualizacao", postsController.incrementarVisualizacao);

export default router;