import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({error: "Token ausente!"})
    }

    const token = authHeader.split(" ")[1];

    try {
        const tokenDecodificado = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = tokenDecodificado;
        next();
    } catch (error) {
        console.log("Erro no authMiddleware:", error.message);
        return res.status(401).json({error: "Token inválido!"})
    }
}