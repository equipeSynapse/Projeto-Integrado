import "dotenv/config";
import express from "express";
import authRoutes from "./routes/auth.routes.js";
import cors from "cors";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
}));

app.get('/', (req, res) => {
  res.send('API Online!');
});

app.use("/api/auth", authRoutes)

app.listen(port, () => {
    console.log(`Servidor Rodando na porta ${port}`);
})