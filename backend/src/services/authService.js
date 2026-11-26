const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');
const erro = require('../lib/erro');

async function cadastrar({ nome, email, senha }) {
  if (!nome || !email || !senha) {
    throw erro(400, 'Nome, email e senha são obrigatórios');
  }

  const existente = await prisma.usuario.findUnique({ where: { email } });
  if (existente) {
    throw erro(409, 'Email já cadastrado');
  }

  const hash = await bcrypt.hash(senha, 10);

  return prisma.usuario.create({
    data: { nome, email, senha: hash },
    select: { id: true, nome: true, email: true, criadoEm: true }
  });
}

async function login({ email, senha }) {
  if (!email || !senha) {
    throw erro(400, 'Email e senha são obrigatórios');
  }

  const usuario = await prisma.usuario.findUnique({ where: { email } });
  const senhaCorreta = usuario && (await bcrypt.compare(senha, usuario.senha));

  if (!senhaCorreta) {
    throw erro(401, 'Email ou senha inválidos');
  }

  const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

  return { token, usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email } };
}

module.exports = { cadastrar, login };
