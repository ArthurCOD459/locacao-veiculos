const jwt = require('jsonwebtoken');
const erro = require('../lib/erro');

module.exports = function autenticar(req, res, next) {
  const cabecalho = req.headers.authorization || '';
  const [tipo, token] = cabecalho.split(' ');

  if (tipo !== 'Bearer' || !token) {
    return next(erro(401, 'Token não informado'));
  }

  try {
    const dados = jwt.verify(token, process.env.JWT_SECRET);
    req.usuarioId = dados.id;
    next();
  } catch {
    next(erro(401, 'Token inválido ou expirado'));
  }
};
