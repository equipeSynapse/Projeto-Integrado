import { transporter } from "../utils/transporterMailConfig.js";
import { emailRedefinicaoSenhaTemplate } from "../templates/emailRedefinirSenha.js";

export const enviarEmailRedefinirSenha = (destinatario, token) => {
   const link = `http://localhost:5173/redefinir-senha?token=${token}&email=${encodeURIComponent(destinatario)}`

   transporter.sendMail({
        from: `Mural Colaborativo - <${process.env.EMAIL_USER}>`,
        to: destinatario,
        subject: "Mensagem de Ativação de Conta - Mural Colaborativo",
        html: emailRedefinicaoSenhaTemplate(link)
    }, (error, info) => {
        
        if (error) {
            return console.log(error)
        }

        console.log("Email enviado! ->", info.response)
    })
}