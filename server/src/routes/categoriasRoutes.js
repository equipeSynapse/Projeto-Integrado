import express from "express";
import * as categoriaController from "../controllers/categoriasControllers.js"
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/seguir-categoria', authMiddleware, categoriaController.seguirCategoria)
router.delete('/desseguir-categoria', authMiddleware, categoriaController.desseguirCategoria)
router.get('/obter-categorias-seguidas', categoriaController.obterCategoriasSeguidas)

export default router;