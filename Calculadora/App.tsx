/// app tsx ///
import { useState } from 'react';
import './App.css';

const BOTOES = [
  ['C', '⌫', '%', '/'],
  ['7', '8', '9', '*'],
  ['4', '5', '6', '-'],
  ['1', '2', '3', '+'],
  ['0', '.', '='],
];

export default function App() {
  const [visor, setVisor] = useState<string>('');
  const [historico, setHistorico] = useState<string[]>([]);

  function pressionar(valor: string) {
    if (valor === 'C') {
      setVisor('');
      return;
    }
    if (valor === '⌫') {
      setVisor(v => v.slice(0, -1));
      return;
    }
    if (valor === '=') {
      if (!visor) return;
      try {
        // eslint-disable-next-line no-eval
        const resultado = eval(visor.replace(/%/g, '/100'));
        setHistorico(h => [`${visor} = ${resultado}`, ...h].slice(0, 10));
        setVisor(String(resultado));
      } catch {
        setVisor('Erro');
      }
      return;
    }
    setVisor(v => v + valor);
  }

  function limparHistorico() {
    setHistorico([]);
  }

  return (
    <div className="container">
      <h1>Calculadora</h1>
      <div className="visor">{visor || '0'}</div>
      <div className="botoes">
        {BOTOES.flat().map((b, i) => (
          <button
            key={i}
            className={`botao ${b === '0' ? 'zero' : ''} ${b === '=' ? 'igual' : ''} ${['+','-','*','/','%'].includes(b) ? 'operador' : ''}`}
            onClick={() => pressionar(b)}
          >
            {b}
          </button>
        ))}
      </div>

      <div className="historico">
        <div className="historico-cabecalho">
          <span>Histórico</span>
          {historico.length > 0 && (
            <button className="limpar" onClick={limparHistorico}>Limpar</button>
          )}
        </div>
        {historico.length === 0 ? (
          <p className="historico-vazio">Nenhuma operação ainda</p>
        ) : (
          <ul className="historico-lista">
            {historico.map((item, i) => (
              <li key={i} onClick={() => setVisor(item.split(' = ')[1])}>
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
        }
