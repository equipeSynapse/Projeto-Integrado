import { transporter } from "../utils/transporterMailConfig.js";
import { emailConfirmacaoTemplate } from "../templates/emailConfirmacao.js";

export const enviarEmailConfirmacao = (destinatario = process.env.EMAIL_USER, token) => {
   const link = `http://localhost:3000/api/auth/ativar-conta?token=${token}`

   transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: destinatario,
        subject: "Mensagem de Confirmação de Email para Mural",
        html: emailConfirmacaoTemplate(link)
    }, (error, info) => {
        
        if (error) {
            return console.log(error)
        }

        console.log("Email enviado! ->", info.response)
    })
}