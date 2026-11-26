module.exports = (funcao) => (req, res, next) => funcao(req, res).catch(next);
