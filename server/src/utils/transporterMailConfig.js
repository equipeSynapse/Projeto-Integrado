import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
    service: "gmail",
    //host: "sandbox.smtp.mailtrap.io",
    //port: 2525,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
})
