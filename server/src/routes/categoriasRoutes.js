import express from "express";
import * as categoriaController from "../controllers/categoriasControllers.js"
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.patch('/seguir-categoria', authMiddleware, categoriaController.seguirCategoria)
router.patch('/desseguir-categoria', authMiddleware, categoriaController.desseguirCategoria)
router.get('/obter-categorias-seguidas', categoriaController.obterCategoriasSeguidas)

export default router;