const prisma = require('../lib/prisma');
const erro = require('../lib/erro');

const MS_POR_DIA = 24 * 60 * 60 * 1000;

async function criar(usuarioId, { veiculoId, dataInicio, dataPrevista }) {
  const inicio = new Date(dataInicio);
  const fim = new Date(dataPrevista);

  if (!veiculoId || isNaN(inicio) || isNaN(fim)) {
    throw erro(400, 'Veículo e datas válidas são obrigatórios');
  }

  if (fim <= inicio) {
    throw erro(400, 'A data prevista deve ser posterior à data de início');
  }

  const veiculo = await prisma.veiculo.findUnique({ where: { id: Number(veiculoId) } });
  if (!veiculo) {
    throw erro(404, 'Veículo não encontrado');
  }

  const diarias = Math.ceil((fim - inicio) / MS_POR_DIA);
  const valorTotal = diarias * Number(veiculo.valorDiaria);

  return prisma.$transaction(async (tx) => {
    const reservado = await tx.veiculo.updateMany({
      where: { id: veiculo.id, disponivel: true },
      data: { disponivel: false }
    });

    if (reservado.count === 0) {
      throw erro(409, 'Veículo indisponível');
    }

    return tx.locacao.create({
      data: {
        usuarioId,
        veiculoId: veiculo.id,
        dataInicio: inicio,
        dataPrevista: fim,
        valorTotal
      },
      include: { veiculo: true }
    });
  });
}

function listar(usuarioId) {
  return prisma.locacao.findMany({
    where: { usuarioId },
    include: { veiculo: true },
    orderBy: { id: 'desc' }
  });
}

async function finalizar(usuarioId, id) {
  const locacaoId = Number(id);
  const locacao = await prisma.locacao.findUnique({ where: { id: locacaoId } });

  if (!locacao) {
    throw erro(404, 'Locação não encontrada');
  }

  if (locacao.usuarioId !== usuarioId) {
    throw erro(403, 'Você não pode finalizar a locação de outro usuário');
  }

  return prisma.$transaction(async (tx) => {
    const encerrada = await tx.locacao.updateMany({
      where: { id: locacaoId, status: 'ATIVA' },
      data: { status: 'FINALIZADA', dataDevolucao: new Date() }
    });

    if (encerrada.count === 0) {
      throw erro(409, 'Locação já finalizada');
    }

    await tx.veiculo.update({
      where: { id: locacao.veiculoId },
      data: { disponivel: true }
    });

    return tx.locacao.findUnique({ where: { id: locacaoId }, include: { veiculo: true } });
  });
}

module.exports = { criar, listar, finalizar };
