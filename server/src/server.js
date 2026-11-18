import "dotenv/config";
import express from "express";
import authRoutes from "./routes/authRoutes.js";
import postsRoutes from "./routes/postsRoutes.js";
import categoriasRoutes from "./routes/categoriasRoutes.js";
import notificacoesRoutes from "./routes/notificacoesRoutes.js";
import denunciasRoutes from "./routes/denunciasRoutes.js";
import profanityRoute from "./routes/profanityRoute.js";
import cors from "cors";
import { schema } from "./database/schema.js";
import { pool } from "./database/db.js";
import { criarBuckets } from "./lib/storage.js";


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
app.use("/api/posts", postsRoutes)
app.use("/api/categorias", categoriasRoutes)
app.use("/api/notificacoes", notificacoesRoutes)
app.use("/api/denuncias", denunciasRoutes)
app.use("/api", profanityRoute)

async function configurarBanco() {
    await pool.query(schema);
    await criarBuckets();
    console.log('Banco de dados pronto.');
}

configurarBanco()
    .then(() => app.listen(port, () => console.log(`Servidor Rodando na porta ${port}`)))
    .catch((error) => {console.error("Falha ao construir o banco:", error); process.exit(1)})
