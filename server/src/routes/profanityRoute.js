import express from "express";
import { checarProfanidade } from "../utils/checkProfanity.js";

const router = express.Router();

router.post('/checar-profanidade', (req, res) => {
    const {texto} = req.body;

    return checarProfanidade(texto) ? res.status(200).json({result: true}) : res.status(200).json({result: false}) 
})

export default router;