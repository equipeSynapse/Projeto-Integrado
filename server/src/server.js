require("dotenv").config();
const express = require('express');
const supabase = require('./config/supabase');
const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API Online!');
});

app.post('/usuarios', async (req, res) => {
  const {email, nome, senha} = req.body;
  try {

    await supabase.from('usuarios')
    .insert([{ email, nome, senha }]);
    res.status(201).json({ message: 'Usuário criado com sucesso!' });
  } catch (error) {

    console.error(error);
    res.status(500).json({ error: 'Erro ao criar usuário.' });
  }


});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});