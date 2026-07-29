import { useState } from 'react';
import './App.css';

type Operador = '+' | '-' | '×' | '÷';

interface HistoricoItem {
  id: number;
  expressao: string;
  resultado: string;
}

export default function App() {
  const [visor, setVisor] = useState('0');
  const [valorAnterior, setValorAnterior] = useState<number | null>(null);
  const [operador, setOperador] = useState<Operador | null>(null);
  const [aguardandoNovo, setAguardandoNovo] = useState(false);
  const [historico, setHistorico] = useState<HistoricoItem[]>([]);

  function inserirNumero(num: string) {
    if (aguardandoNovo) {
      setVisor(num);
      setAguardandoNovo(false);
    } else {
      setVisor(visor === '0' ? num : visor + num);
    }
  }

  function inserirPonto() {
    if (aguardandoNovo) {
      setVisor('0.');
      setAguardandoNovo(false);
      return;
    }
    if (!visor.includes('.')) setVisor(visor + '.');
  }

  function calcular(a: number, b: number, op: Operador): number {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '×': return a * b;
      case '÷': return b === 0 ? NaN : a / b;
    }
  }

  function registrarHistorico(a: number, op: Operador, b: number, resultado: number) {
    setHistorico(h => [
      { id: Date.now(), expressao: `${a} ${op} ${b}`, resultado: String(resultado) },
      ...h,
    ].slice(0, 20));
  }

  function escolherOperador(op: Operador) {
    const atual = parseFloat(visor);

    if (valorAnterior !== null && operador && !aguardandoNovo) {
      const resultado = calcular(valorAnterior, atual, operador);
      registrarHistorico(valorAnterior, operador, atual, resultado);
      setVisor(String(resultado));
      setValorAnterior(resultado);
    } else {
      setValorAnterior(atual);
    }

    setOperador(op);
    setAguardandoNovo(true);
  }

  function igual() {
    if (valorAnterior === null || operador === null) return;
    const atual = parseFloat(visor);
    const resultado = calcular(valorAnterior, atual, operador);
    registrarHistorico(valorAnterior, operador, atual, resultado);
    setVisor(String(resultado));
    setValorAnterior(null);
    setOperador(null);
    setAguardandoNovo(true);
  }

  function limpar() {
    setVisor('0');
    setValorAnterior(null);
    setOperador(null);
    setAguardandoNovo(false);
  }

  function limparHistorico() {
    setHistorico([]);
  }

  function trocarSinal() {
    setVisor(String(parseFloat(visor) * -1));
  }

  return (
    <div className="tela">
      <div className="calculadora">
        <div className="visor">{visor}</div>
        <div className="grid">
          <button className="btn btn-cinza" onClick={limpar}>C</button>
          <button className="btn btn-cinza" onClick={trocarSinal}>±</button>
          <button className="btn btn-cinza" onClick={() => escolherOperador('÷')}>÷</button>
          <button className="btn btn-azul" onClick={() => escolherOperador('×')}>×</button>

          <button className="btn" onClick={() => inserirNumero('7')}>7</button>
          <button className="btn" onClick={() => inserirNumero('8')}>8</button>
          <button className="btn" onClick={() => inserirNumero('9')}>9</button>
          <button className="btn btn-azul" onClick={() => escolherOperador('-')}>-</button>

          <button className="btn" onClick={() => inserirNumero('4')}>4</button>
          <button className="btn" onClick={() => inserirNumero('5')}>5</button>
          <button className="btn" onClick={() => inserirNumero('6')}>6</button>
          <button className="btn btn-azul" onClick={() => escolherOperador('+')}>+</button>

          <button className="btn" onClick={() => inserirNumero('1')}>1</button>
          <button className="btn" onClick={() => inserirNumero('2')}>2</button>
          <button className="btn" onClick={() => inserirNumero('3')}>3</button>
          <button className="btn btn-igual" onClick={igual} style={{ gridRow: 'span 2' }}>=</button>

          <button className="btn btn-zero" onClick={() => inserirNumero('0')}>0</button>
          <button className="btn" onClick={inserirPonto}>.</button>
        </div>
      </div>

      <div className="historico">
        <div className="historico-cabecalho">
          <span>Histórico</span>
          {historico.length > 0 && (
            <button className="historico-limpar" onClick={limparHistorico}>Limpar</button>
          )}
        </div>
        {historico.length === 0 ? (
          <p className="historico-vazio">Nenhuma conta ainda</p>
        ) : (
          <ul className="historico-lista">
            {historico.map(item => (
              <li key={item.id} className="historico-item">
                <span className="historico-expressao">{item.expressao}</span>
                <span className="historico-resultado">= {item.resultado}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

.tela {
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 20px;
  background: #eaf2ff;
  padding: 40px 20px;
  flex-wrap: wrap;
}

.calculadora {
  width: 300px;
  background: #ffffff;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 4px 20px rgba(29, 78, 216, 0.15);
}

.visor {
  background: #1d4ed8;
  color: #ffffff;
  font-size: 36px;
  font-weight: 600;
  text-align: right;
  padding: 20px 16px;
  border-radius: 12px;
  margin-bottom: 12px;
  overflow-x: auto;
  white-space: nowrap;
}

.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.btn {
  height: 60px;
  border: none;
  border-radius: 12px;
  background: #eaf2ff;
  color: #0f2a5c;
  font-size: 20px;
  font-weight: 600;
  cursor: pointer;
  transition: filter 0.15s ease;
}

.btn:active {
  filter: brightness(0.92);
}

.btn-cinza {
  background: #dbeafe;
  color: #1d4ed8;
}

.btn-azul {
  background: #1d4ed8;
  color: #ffffff;
}

.btn-igual {
  background: #0f2a5c;
  color: #ffffff;
}

.btn-zero {
  grid-column: span 2;
}

.historico {
  width: 260px;
  background: #ffffff;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 4px 20px rgba(29, 78, 216, 0.15);
  max-height: 420px;
  display: flex;
  flex-direction: column;
}

.historico-cabecalho {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 700;
  color: #0f2a5c;
  margin-bottom: 10px;
}

.historico-limpar {
  border: none;
  background: none;
  color: #1d4ed8;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.historico-vazio {
  color: #9ca3af;
  font-size: 13px;
}

.historico-lista {
  list-style: none;
  padding: 0;
  margin: 0;
  overflow-y: auto;
}

.historico-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #eaf2ff;
  font-size: 14px;
}

.historico-expressao {
  color: #6b7280;
}

.historico-resultado {
  color: #0f2a5c;
  font-weight: 700;
    }
