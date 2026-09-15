require("dotenv").config();
const express = require('express');
const supabase = require('./config/supabase');
const app = express();
const port = 3000;

const UserRoutes = require('./routes/UserRoutes');

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API Online!');
});

app.use('/api', UserRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});