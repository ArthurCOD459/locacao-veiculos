const prisma = require('../lib/prisma');
const erro = require('../lib/erro');

async function cadastrar({ marca, modelo, placa, ano, valorDiaria }) {
  if (!marca || !modelo || !placa || !ano || !valorDiaria) {
    throw erro(400, 'Todos os campos são obrigatórios');
  }

  if (Number(valorDiaria) <= 0) {
    throw erro(400, 'O valor da diária deve ser positivo');
  }

  const existente = await prisma.veiculo.findUnique({ where: { placa } });
  if (existente) {
    throw erro(409, 'Placa já cadastrada');
  }

  return prisma.veiculo.create({
    data: { marca, modelo, placa, ano: Number(ano), valorDiaria: Number(valorDiaria) }
  });
}

function listar(somenteDisponiveis) {
  return prisma.veiculo.findMany({
    where: somenteDisponiveis ? { disponivel: true } : {},
    orderBy: { id: 'asc' }
  });
}

module.exports = { cadastrar, listar };
