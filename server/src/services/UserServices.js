const supabase = require('../config/supabase');

class UserServices {
    async createUser(email, nome_completo, username, senha) {
        const { data, error } = await supabase
            .from('usuarios')
            .insert([{ email, nome_completo, username, senha }]);

        if (error) {
            throw error;
        }

        return data;
    }
}

module.exports = new UserServices();