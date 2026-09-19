import * as hashConfig from "../utils/hashConfig.js";
import { pool } from "../database/db.js";

class UserServices {
    async createUser(email, nome_completo, nome_usuario, senha, token_ativacao) {
        const hashPass = await hashConfig.gerarHash(senha);

        const query = `
            INSERT INTO usuarios (
                email,
                nome_completo,
                nome_usuario,
                senha,
                token_ativacao
            )
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;

        const values = [
            email,
            nome_completo,
            nome_usuario,
            hashPass,
            token_ativacao
        ];

        const result = await pool.query(query, values);

        return result.rows[0];
    }
}

export default new UserServices();