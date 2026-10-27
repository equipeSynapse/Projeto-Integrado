import "dotenv/config";
import express from "express";
import authRoutes from "./routes/authRoutes.js";
import postsRoutes from "./routes/postsRoutes.js";
import categoriasRoutes from "./routes/categoriasRoutes.js";
import cors from "cors";

const app = express();
export const port = 3000;

app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173', 'https://projeto-integrado-frontend-a74e.onrender.com'],
}));

app.get('/', (req, res) => {
  res.send('API Online!');
});

app.use("/api/auth", authRoutes)
app.use(postsRoutes)
app.use("/api/posts", postsRoutes)
app.use("/api/categorias", categoriasRoutes)

app.listen(port, () => {
    console.log(`Servidor Rodando na porta ${port}`);
})
