const bcrypt = require('bcrypt');

const gerarHash =  async(senha) => {
    return bcrypt.hash(senha, 12)
}

const compararHash = async(senha, hashSenha) => {
    return bcrypt.compare(senha, hashSenha)
}

module.exports = {gerarHash, compararHash}
