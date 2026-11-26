const service = require('../services/authService');

async function cadastrar(req, res) {
  const usuario = await service.cadastrar(req.body);
  res.status(201).json(usuario);
}

async function login(req, res) {
  const resultado = await service.login(req.body);
  res.json(resultado);
}

module.exports = { cadastrar, login };
