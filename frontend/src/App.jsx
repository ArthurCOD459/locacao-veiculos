import { useEffect, useState } from 'react';
import { api } from './api';
import Login from './components/Login';
import Veiculos from './components/Veiculos';
import Locacoes from './components/Locacoes';

export default function App() {
  const [usuario, setUsuario] = useState(JSON.parse(localStorage.getItem('usuario') || 'null'));
  const [veiculos, setVeiculos] = useState([]);
  const [locacoes, setLocacoes] = useState([]);
  const [aviso, setAviso] = useState(null);

  function avisar(tipo, texto) {
    setAviso({ tipo, texto });
  }

  async function carregar() {
    try {
      setVeiculos(await api('/veiculos'));
      setLocacoes(await api('/locacoes'));
    } catch (erro) {
      avisar('erro', erro.message);
    }
  }

  useEffect(() => {
    if (usuario) {
      carregar();
    }
  }, [usuario]);

  function entrar(dados) {
    localStorage.setItem('token', dados.token);
    localStorage.setItem('usuario', JSON.stringify(dados.usuario));
    setAviso(null);
    setUsuario(dados.usuario);
  }

  function sair() {
    localStorage.clear();
    setAviso(null);
    setUsuario(null);
  }

  return (
    <div>
      <header>
        <h1>Locadora de Veículos</h1>
        {usuario && (
          <div>
            {usuario.nome} <button onClick={sair}>Sair</button>
          </div>
        )}
      </header>

      {aviso && <p className={aviso.tipo}>{aviso.texto}</p>}

      {!usuario && <Login aoEntrar={entrar} avisar={avisar} />}

      {usuario && (
        <>
          <Veiculos veiculos={veiculos} aoAlterar={carregar} avisar={avisar} />
          <Locacoes veiculos={veiculos} locacoes={locacoes} aoAlterar={carregar} avisar={avisar} />
        </>
      )}
    </div>
  );
}
