module.exports = function erro(status, mensagem) {
  const e = new Error(mensagem);
  e.status = status;
  return e;
};
