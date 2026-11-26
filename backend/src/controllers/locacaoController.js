const service = require('../services/locacaoService');

async function criar(req, res) {
  const locacao = await service.criar(req.usuarioId, req.body);
  res.status(201).json(locacao);
}

async function listar(req, res) {
  const locacoes = await service.listar(req.usuarioId);
  res.json(locacoes);
}

async function finalizar(req, res) {
  const locacao = await service.finalizar(req.usuarioId, req.params.id);
  res.json(locacao);
}

module.exports = { criar, listar, finalizar };
