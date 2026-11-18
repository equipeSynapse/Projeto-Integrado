export default function mascararData(texto) {
    const n = texto.replace(/\D/g, '').slice(0, 8)
    if (n.length > 4) return `${n.slice(0, 2)}/${n.slice(2, 4)}/${n.slice(4)}`
    if (n.length > 2) return `${n.slice(0, 2)}/${n.slice(2)}`
    return n
}