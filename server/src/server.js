import "dotenv/config";
import express from "express";
import authRoutes from "./routes/authRoutes.js";

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API Online!');
});

app.use("/api/auth", authRoutes)

app.listen(port, () => {
    console.log(`Servidor Rodando na porta ${port}`);
})