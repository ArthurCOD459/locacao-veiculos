import { useState } from 'react';
import { api } from '../api';

const vazio = { marca: '', modelo: '', placa: '', ano: '', valorDiaria: '' };

export default function Veiculos({ veiculos, aoAlterar, avisar }) {
  const [form, setForm] = useState(vazio);
  const [somenteDisponiveis, setSomenteDisponiveis] = useState(false);

  function mudar(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function enviar(e) {
    e.preventDefault();

    try {
      await api('/veiculos', 'POST', form);
      avisar('sucesso', 'Veículo cadastrado');
      setForm(vazio);
      aoAlterar();
    } catch (erro) {
      avisar('erro', erro.message);
    }
  }

  const lista = somenteDisponiveis ? veiculos.filter((v) => v.disponivel) : veiculos;

  return (
    <section>
      <h2>Veículos</h2>
      <form onSubmit={enviar}>
        <label>
          Marca
          <input name="marca" value={form.marca} onChange={mudar} />
        </label>
        <label>
          Modelo
          <input name="modelo" value={form.modelo} onChange={mudar} />
        </label>
        <label>
          Placa
          <input name="placa" value={form.placa} onChange={mudar} />
        </label>
        <label>
          Ano
          <input name="ano" type="number" value={form.ano} onChange={mudar} />
        </label>
        <label>
          Diária (R$)
          <input name="valorDiaria" type="number" step="0.01" value={form.valorDiaria} onChange={mudar} />
        </label>
        <button type="submit">Cadastrar veículo</button>
      </form>

      <p>
        <label>
          <input
            type="checkbox"
            checked={somenteDisponiveis}
            onChange={(e) => setSomenteDisponiveis(e.target.checked)}
          />
          Mostrar somente disponíveis
        </label>
      </p>

      <table>
        <thead>
          <tr>
            <th>Veículo</th>
            <th>Placa</th>
            <th>Ano</th>
            <th>Diária</th>
            <th>Situação</th>
          </tr>
        </thead>
        <tbody>
          {lista.map((v) => (
            <tr key={v.id}>
              <td>{v.marca} {v.modelo}</td>
              <td>{v.placa}</td>
              <td>{v.ano}</td>
              <td>R$ {Number(v.valorDiaria).toFixed(2)}</td>
              <td>{v.disponivel ? 'Disponível' : 'Alugado'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
