const pool = require('../config/supabase');
const bcrypt = require('bcrypt');
class UserServices {
    async createUser(email, nome_completo, username, senha) {
        const hashPass = await bcrypt.hash(senha, 10);
        const query = `
            INSERT INTO usuarios (
                email,
                nome_completo,
                username,
                senha
            )
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;

        const values = [
            email,
            nome_completo,
            username,
            hashPass
        ];

        const result = await pool.query(query, values);

        return result.rows[0];
    }
}

module.exports = new UserServices();