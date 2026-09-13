import 'dotenv/config'
import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
    //service: "gmail",
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASSWORD
    }
})
