import { useState } from 'react';
import { api } from '../api';

export default function Login({ aoEntrar, avisar }) {
  const [cadastro, setCadastro] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  async function enviar(e) {
    e.preventDefault();

    try {
      if (cadastro) {
        await api('/auth/cadastro', 'POST', { nome, email, senha });
        avisar('sucesso', 'Cadastro realizado. Faça login.');
        setCadastro(false);
        return;
      }

      const dados = await api('/auth/login', 'POST', { email, senha });
      aoEntrar(dados);
    } catch (erro) {
      avisar('erro', erro.message);
    }
  }

  return (
    <section>
      <h2>{cadastro ? 'Cadastro' : 'Login'}</h2>
      <form onSubmit={enviar}>
        {cadastro && (
          <label>
            Nome
            <input value={nome} onChange={(e) => setNome(e.target.value)} />
          </label>
        )}
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          Senha
          <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} />
        </label>
        <button type="submit">{cadastro ? 'Cadastrar' : 'Entrar'}</button>
        <button type="button" onClick={() => setCadastro(!cadastro)}>
          {cadastro ? 'Já tenho conta' : 'Criar conta'}
        </button>
      </form>
    </section>
  );
}
