const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const senha = await bcrypt.hash('123456', 10);
  await prisma.usuario.upsert({
    where: { email: 'teste@teste.com' },
    update: {},
    create: { nome: 'Usuario Teste', email: 'teste@teste.com', senha }
  });

  const veiculos = [
    { marca: 'Fiat', modelo: 'Mobi', placa: 'ABC1D23', ano: 2022, valorDiaria: 120 },
    { marca: 'Chevrolet', modelo: 'Onix', placa: 'DEF4G56', ano: 2023, valorDiaria: 150 },
    { marca: 'Volkswagen', modelo: 'Polo', placa: 'HIJ7K89', ano: 2024, valorDiaria: 180 }
  ];

  for (const v of veiculos) {
    await prisma.veiculo.upsert({ where: { placa: v.placa }, update: {}, create: v });
  }
}

main().finally(() => prisma.$disconnect());
