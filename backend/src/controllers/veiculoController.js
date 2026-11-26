const service = require('../services/veiculoService');

async function cadastrar(req, res) {
  const veiculo = await service.cadastrar(req.body);
  res.status(201).json(veiculo);
}

async function listar(req, res) {
  const veiculos = await service.listar(req.query.disponivel === 'true');
  res.json(veiculos);
}

module.exports = { cadastrar, listar };
