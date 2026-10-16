import { getDay, getDaysInMonth, startOfMonth } from "date-fns";

export default function gerarMatrizDias(dataBase) {
    const totalDias = getDaysInMonth(dataBase)
    const diaSemanaInicio = getDay(startOfMonth(dataBase))

    const matrizDias = []

    for (let i = 0; i < diaSemanaInicio; i++) {
        matrizDias.push(null);
    }

    for (let dia = 1; dia <= totalDias; dia++) {
        matrizDias.push(new Date(dataBase.getFullYear(), dataBase.getMonth(), dia));
    }

    return matrizDias;
}