import { isValid, parse } from "date-fns";

export default function validarData(texto) {
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(texto)) return null;

    const parsed = parse(texto, "dd/MM/yyyy", new Date());
    return isValid(parsed) ? parsed : null;
}