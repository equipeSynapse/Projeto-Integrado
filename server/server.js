import "dotenv/config";
import express from "express";
import authRoutes from "./routes/auth.routes.js";
import { enviarEmailConfirmacao } from "./services/enviarEmail.js";

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes)

app.listen(3000, () => {
    console.log("Servidor Rodando na porta 3000");
})