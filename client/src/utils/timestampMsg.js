export default function timestampMsg(diffTime){
    const minutes = Math.floor(diffTime / (1000 * 60))
    if (minutes < 60) return `${minutes} minutos`

    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours} horas`

    const days = Math.floor(hours / 24)
    return `${days} dias`
  }