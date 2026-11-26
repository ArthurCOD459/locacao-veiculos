const URL_BASE = 'http://localhost:3000/api';

export async function api(caminho, metodo = 'GET', corpo) {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };

  if (token) {
    headers.Authorization = 'Bearer ' + token;
  }

  const resposta = await fetch(URL_BASE + caminho, {
    method: metodo,
    headers,
    body: corpo ? JSON.stringify(corpo) : undefined
  });

  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(dados.erro || 'Erro na requisição');
  }

  return dados;
}
