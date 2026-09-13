import "dotenv/config";
import { transporter } from "../utils/transporterMailConfig.js";
import { emailConfirmacaoTemplate } from "../templates/emailConfirmacao.js";

export const enviarEmailConfirmacao = (destinatario = process.env.EMAIL_USER) => {
    
   transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: destinatario,
        subject: "Mensagem de Confirmação de Email para Mural",
        html: emailConfirmacaoTemplate
    }, (error, info) => {
        
        if (error) {
            return console.log(error)
        }

        console.log(info.response)
    })
}