export default function mascararEmail(email) {
    if (!email || !email.includes("@")) return email || "seu e-mail";
    const [usuario, dominio] = email.split("@");
    if (usuario.length <= 3) {
        return `${usuario}****@${dominio}`;
    }
    return `${usuario.slice(0, 3)}****@${dominio}`;
}