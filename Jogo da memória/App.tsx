/// App.tsx///

import { useState, useEffect } from 'react';
import './App.css';

interface Carta {
  id: number;
  valor: string;
  virada: boolean;
  encontrada: boolean;
}

type Nivel = 1 | 2 | 3;

const SIMBOLOS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const CARTAS_POR_NIVEL: Record<Nivel, number> = { 1: 8, 2: 12, 3: 16 };

function gerarCartas(nivel: Nivel): Carta[] {
  const total = CARTAS_POR_NIVEL[nivel];
  const pares = SIMBOLOS.slice(0, total / 2);
  return [...pares, ...pares]
    .map((valor, i) => ({ id: i, valor, virada: false, encontrada: false }))
    .sort(() => Math.random() - 0.5);
}

export default function App() {
  const [nivel, setNivel] = useState<Nivel>(1);
  const [cartas, setCartas] = useState<Carta[]>(gerarCartas(1));
  const [viradas, setViradas] = useState<number[]>([]);
  const [pontuacao, setPontuacao] = useState<number>(0);
  const [tempo, setTempo] = useState<number>(0);
  const [rodando, setRodando] = useState<boolean>(true);
  const [nivelCompleto, setNivelCompleto] = useState<boolean>(false);

  useEffect(() => {
    if (!rodando) return;
    const intervalo = setInterval(() => setTempo(t => t + 1), 1000);
    return () => clearInterval(intervalo);
  }, [rodando]);

  useEffect(() => {
    if (cartas.every(c => c.encontrada)) {
      setRodando(false);
      setNivelCompleto(true);
    }
  }, [cartas]);

  function virarCarta(id: number) {
    if (!rodando || viradas.length === 2) return;
    const carta = cartas.find(c => c.id === id);
    if (!carta || carta.virada || carta.encontrada) return;

    const novasCartas = cartas.map(c => c.id === id ? { ...c, virada: true } : c);
    const novasViradas = [...viradas, id];
    setCartas(novasCartas);
    setViradas(novasViradas);

    if (novasViradas.length === 2) {
      const [id1, id2] = novasViradas;
      const c1 = novasCartas.find(c => c.id === id1)!;
      const c2 = novasCartas.find(c => c.id === id2)!;

      if (c1.valor === c2.valor) {
        setPontuacao(p => p + Math.max(100 - tempo, 10));
        setCartas(cs => cs.map(c =>
          c.id === id1 || c.id === id2 ? { ...c, encontrada: true } : c
        ));
        setViradas([]);
      } else {
        setTimeout(() => {
          setCartas(cs => cs.map(c =>
            c.id === id1 || c.id === id2 ? { ...c, virada: false } : c
          ));
          setViradas([]);
        }, 800);
      }
    }
  }

  function proximoNivel() {
    const prox = (nivel + 1) as Nivel;
    setNivel(prox);
    setCartas(gerarCartas(prox));
    setViradas([]);
    setTempo(0);
    setRodando(true);
    setNivelCompleto(false);
  }

  function reiniciar() {
    setNivel(1);
    setCartas(gerarCartas(1));
    setViradas([]);
    setPontuacao(0);
    setTempo(0);
    setRodando(true);
    setNivelCompleto(false);
  }

  return (
    <div className="container">
      <h1>Jogo da Memória</h1>
      <div className="painel">
        <span>Nível: {nivel}/3</span>
        <span>Pontos: {pontuacao}</span>
        <span>Tempo: {tempo}s</span>
      </div>

      {nivelCompleto ? (
        <div className="mensagem">
          <p>Nível {nivel} concluído em {tempo}s!</p>
          {nivel < 3 ? (
            <button onClick={proximoNivel}>Próximo nível</button>
          ) : (
            <>
              <p>Jogo finalizado! Pontuação final: {pontuacao}</p>
              <button onClick={reiniciar}>Jogar novamente</button>
            </>
          )}
        </div>
      ) : (
        <div className="grid">
          {cartas.map(carta => (
            <button
              key={carta.id}
              className="carta-container"
              onClick={() => virarCarta(carta.id)}
            >
              <div className={`carta ${carta.virada || carta.encontrada ? 'virada' : ''}`}>
                <div className="carta-verso">?</div>
                <div className={`carta-frente ${carta.encontrada ? 'encontrada' : ''}`}>
                  {carta.valor}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
            }
