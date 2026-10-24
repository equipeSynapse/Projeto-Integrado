export default function timestampMsg(newestTime, oldestTime, short=false){
    const diffTime = newestTime - oldestTime

    const minutes = Math.floor(diffTime / (1000 * 60))
    if (minutes < 60) {
      if (short) return `há ${minutes} min`
      return `há ${minutes} minutos`
    }

    const hours = Math.floor(minutes / 60)
    if (hours < 24) {
      if (short) return `$há ${hours}h`
      return `$há ${hours} horas`
    }

    const days = Math.floor(hours / 24)

    if (short) return `há ${days} dias`

    return `em ${new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(oldestTime)}`
  }