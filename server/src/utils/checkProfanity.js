import { analisar } from 'profanity-br';

export const checarProfanidade = (texto) => {
    if (!texto) return false;
    const analise = analisar(texto, { limites: { vulgaridadeMax: 0, alvoSeveridadeMax: 0 }})

    return analise.excedeuLimites;
}

