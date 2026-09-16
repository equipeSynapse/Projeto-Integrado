import bcrypt from 'bcrypt'

export const gerarHash =  async(inputSenha) => {
    return bcrypt.hash(inputSenha, 12)
}

export const compararHash = async(inputSenha, hashSenha) => {
    return bcrypt.compare(inputSenha, hashSenha)
}

