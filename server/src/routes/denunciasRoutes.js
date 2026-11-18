import express from "express";
import * as denunciasController from "../controllers/denunciasControllers.js";
import { authMiddleware } from "../middlewares/authMiddleware.js"
import { moderadorMiddleware } from "../middlewares/moderadorMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, denunciasController.criarDenuncia)
router.get("/usuario", authMiddleware, denunciasController.listarMinhasDenuncias)
router.get("/", authMiddleware, moderadorMiddleware, denunciasController.listarTodasDenuncias)
router.patch("/status/:id", authMiddleware, moderadorMiddleware, denunciasController.atualizarStatusDenuncia)

export default router;
