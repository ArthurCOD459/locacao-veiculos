import { useState } from 'react';
import { api } from '../api';

export default function Locacoes({ veiculos, locacoes, aoAlterar, avisar }) {
  const [veiculoId, setVeiculoId] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataPrevista, setDataPrevista] = useState('');

  const disponiveis = veiculos.filter((v) => v.disponivel);

  async function alugar(e) {
    e.preventDefault();

    try {
      const locacao = await api('/locacoes', 'POST', {
        veiculoId,
        dataInicio: dataInicio ? new Date(dataInicio).toISOString() : '',
        dataPrevista: dataPrevista ? new Date(dataPrevista).toISOString() : ''
      });
      avisar('sucesso', 'Locação registrada. Valor total: R$ ' + Number(locacao.valorTotal).toFixed(2));
      setVeiculoId('');
      setDataInicio('');
      setDataPrevista('');
      aoAlterar();
    } catch (erro) {
      avisar('erro', erro.message);
    }
  }

  async function finalizar(id) {
    try {
      await api('/locacoes/' + id + '/finalizar', 'PATCH');
      avisar('sucesso', 'Locação finalizada');
      aoAlterar();
    } catch (erro) {
      avisar('erro', erro.message);
    }
  }

  return (
    <section>
      <h2>Locações</h2>
      <form onSubmit={alugar}>
        <label>
          Veículo
          <select value={veiculoId} onChange={(e) => setVeiculoId(e.target.value)}>
            <option value="">Selecione</option>
            {disponiveis.map((v) => (
              <option key={v.id} value={v.id}>
                {v.marca} {v.modelo} - {v.placa}
              </option>
            ))}
          </select>
        </label>
        <label>
          Início
          <input type="datetime-local" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
        </label>
        <label>
          Devolução prevista
          <input type="datetime-local" value={dataPrevista} onChange={(e) => setDataPrevista(e.target.value)} />
        </label>
        <button type="submit">Registrar locação</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Veículo</th>
            <th>Início</th>
            <th>Prevista</th>
            <th>Devolução</th>
            <th>Valor</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {locacoes.map((l) => (
            <tr key={l.id}>
              <td>{l.veiculo.marca} {l.veiculo.modelo}</td>
              <td>{new Date(l.dataInicio).toLocaleString('pt-BR')}</td>
              <td>{new Date(l.dataPrevista).toLocaleString('pt-BR')}</td>
              <td>{l.dataDevolucao ? new Date(l.dataDevolucao).toLocaleString('pt-BR') : '-'}</td>
              <td>R$ {Number(l.valorTotal).toFixed(2)}</td>
              <td>{l.status}</td>
              <td>
                {l.status === 'ATIVA' && <button onClick={() => finalizar(l.id)}>Finalizar</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
