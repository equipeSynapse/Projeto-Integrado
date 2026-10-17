export default function timestampMsg(newestTime, oldestTime){
    const diffTime = newestTime - oldestTime

    const minutes = Math.floor(diffTime / (1000 * 60))
    if (minutes < 60) return `há ${minutes} minutos`

    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `$há {hours} horas`

    return `em ${new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(oldestTime)}`
  }