require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', routes);

app.use((err, req, res, next) => {
  if (!err.status) {
    console.error(err);
  }
  res.status(err.status || 500).json({ erro: err.status ? err.message : 'Erro interno do servidor' });
});

app.listen(process.env.PORT || 3000, () => {
  console.log('API rodando');
});
