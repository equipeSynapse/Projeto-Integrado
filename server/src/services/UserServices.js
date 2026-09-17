const pool = require('../config/supabase');
class UserServices {
    async createUser(email, nome_completo, username, senha) {
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
            senha
        ];

        const result = await pool.query(query, values);

        return result.rows[0];
    }
}

module.exports = new UserServices();