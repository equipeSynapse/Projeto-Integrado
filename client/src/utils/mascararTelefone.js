export default function mascaraTelefone(texto) {
    const n = texto.replace(/\D/g, '').slice(0, 11)
    if (n.length > 10) return `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7)}`
    if (n.length > 6) return `(${n.slice(0, 2)}) ${n.slice(2, 6)}-${n.slice(6)}`
    if (n.length > 2) return `(${n.slice(0, 2)}) ${n.slice(2)}`
    if (n.length > 0) return `(${n}`
    return ''
}