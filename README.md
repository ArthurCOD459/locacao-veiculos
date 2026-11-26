# Sistema de Locação de Veículos

API REST (Node.js, Express, Prisma, MySQL, JWT, bcrypt) com interface em React.

## Integrantes

* Arthur Lacerda Paiva De França



## Funcionalidades

* Cadastro e login de usuários (senha com bcrypt, autenticação com JWT)
* Cadastro e listagem de veículos, com filtro de disponíveis
* Registro de locação com cálculo do valor no backend (fração de 24h conta como diária completa)
* Histórico de locações do usuário autenticado e finalização (devolução)

## Requisitos

* Node.js 18 ou superior
* MySQL em execução

## Backend

```
cd backend
npm install
copy .env.example .env
```

Edite o `.env` com a conexão do seu MySQL (`DATABASE\_URL`) e um `JWT\_SECRET`. Depois:

```
npx prisma migrate dev --name init
npm run seed
npm run dev
```

A API sobe em `http://localhost:3000/api`. O seed cria o usuário `teste@teste.com` (senha `123456`) e três veículos.

## Frontend

```
cd frontend
npm install
npm run dev
```

Acesse `http://localhost:5173`.

## Rotas da API

|Método|Rota|Proteção|
|-|-|-|
|POST|/api/auth/cadastro|pública|
|POST|/api/auth/login|pública|
|GET|/api/veiculos (use `?disponivel=true` para filtrar)|JWT|
|POST|/api/veiculos|JWT|
|GET|/api/locacoes|JWT|
|POST|/api/locacoes|JWT|
|PATCH|/api/locacoes/:id/finalizar|JWT|

## Decisões

* Routes só mapeiam endpoints, Controllers cuidam de entrada e resposta HTTP, Services guardam as regras de negócio.
* O usuário da locação vem do token, nunca do corpo da requisição.
* O veículo é reservado com `updateMany` condicional dentro de uma transação, o que evita duas locações ativas simultâneas.

