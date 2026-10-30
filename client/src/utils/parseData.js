import { isValid, parse } from "date-fns"

export default function parseData(texto) {
    if (texto.length !== 10) return null
    const d = parse(texto, 'dd/MM/yyyy', new Date())
    return isValid(d) ? d : null
}