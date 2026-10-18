import { transporter } from "../utils/transporterMailConfig.js";
import { emailConfirmacaoTemplate } from "../templates/emailConfirmacao.js";
import { port } from "../server.js";

export const enviarEmailConfirmacao = (destinatario, token) => {
   const link = `http://localhost:${port}/api/auth/ativar-conta?token=${token}`

   transporter.sendMail({
        from: `Mural Colaborativo - <${process.env.EMAIL_USER}>`,
        to: destinatario,
        subject: "Mensagem de Ativação de Conta - Mural Colaborativo",
        html: emailConfirmacaoTemplate(link)
    }, (error, info) => {
        
        if (error) {
            return console.log(error)
        }

        console.log("Email enviado! ->", info.response)
    })
}