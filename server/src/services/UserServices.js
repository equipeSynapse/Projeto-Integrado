const supabase = require('../config/supabase');
class UserServices {
    async createUser(email, nome, senha) {
        const { data, error } = await supabase
        .from('usuarios')
        .insert([{ email, nome, senha }]);
    }
}

module.exports = new UserServices();