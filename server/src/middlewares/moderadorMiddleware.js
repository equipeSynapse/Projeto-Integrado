export const moderadorMiddleware = (req, res, next) => {
    const email_usuario = req.usuario.email;

    if (email_usuario !== "casmd@virtual.ufc.br") {
        return res.status(403).json({mensagem: "Essa ação é autorizada apenas para moderadores!"})
    }

    next();

}