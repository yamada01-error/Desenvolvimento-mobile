import { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Animated } from 'react-native';

interface Carta {
  id: number;
  valor: string;
  virada: boolean;
  encontrada: boolean;
  errada: boolean;
}

type Nivel = 1 | 2 | 3;

const SIMBOLOS = ['🐶', '🐱', '🦊', '🐼', '🐸', '🦄', '🐧', '🐢'];
const CARTAS_POR_NIVEL: Record<Nivel, number> = { 1: 8, 2: 12, 3: 16 };

function gerarCartas(nivel: Nivel): Carta[] {
  const total = CARTAS_POR_NIVEL[nivel];
  const pares = SIMBOLOS.slice(0, total / 2);
  return [...pares, ...pares]
    .map((valor, i) => ({ id: i, valor, virada: false, encontrada: false, errada: false }))
    .sort(() => Math.random() - 0.5);
}

function CartaItem({ carta, onPress }: { carta: Carta; onPress: () => void }) {
  const animado = useRef(new Animated.Value(carta.encontrada ? 180 : 0)).current;

  useEffect(() => {
    Animated.timing(animado, {
      toValue: carta.virada || carta.encontrada ? 180 : 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [carta.virada, carta.encontrada]);

  const rotarVerso = animado.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });
  const rotarFrente = animado.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  return (
    <Pressable style={styles.cartaContainer} onPress={onPress}>
      <Animated.View
        style={[
          styles.face,
          styles.verso,
          { transform: [{ perspective: 800 }, { rotateY: rotarVerso }] },
        ]}
      >
        <Text style={styles.textoVerso}>?</Text>
      </Animated.View>
      <Animated.View
        style={[
          styles.face,
          styles.frente,
          carta.encontrada && styles.frenteEncontrada,
          carta.errada && styles.frenteErrada,
          { transform: [{ perspective: 800 }, { rotateY: rotarFrente }] },
        ]}
      >
        <Text style={styles.textoFrente}>{carta.valor}</Text>
      </Animated.View>
    </Pressable>
  );
}

export default function Page() {
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

    const novasCartas = cartas.map(c => (c.id === id ? { ...c, virada: true } : c));
    const novasViradas = [...viradas, id];
    setCartas(novasCartas);
    setViradas(novasViradas);

    if (novasViradas.length === 2) {
      const [id1, id2] = novasViradas;
      const c1 = novasCartas.find(c => c.id === id1)!;
      const c2 = novasCartas.find(c => c.id === id2)!;

      if (c1.valor === c2.valor) {
        setPontuacao(p => p + Math.max(100 - tempo, 10));
        setCartas(cs =>
          cs.map(c => (c.id === id1 || c.id === id2 ? { ...c, encontrada: true } : c))
        );
        setViradas([]);
      } else {
        setCartas(cs =>
          cs.map(c => (c.id === id1 || c.id === id2 ? { ...c, errada: true } : c))
        );
        setTimeout(() => {
          setCartas(cs =>
            cs.map(c =>
              c.id === id1 || c.id === id2 ? { ...c, virada: false, errada: false } : c
            )
          );
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

  function reiniciarNivel() {
    setCartas(gerarCartas(nivel));
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
    <View style={styles.container}>
      <Text style={styles.titulo}>Jogo da Memória</Text>
      <View style={styles.painel}>
        <Text style={styles.painelTexto}>Nível: {nivel}/3</Text>
        <Text style={styles.painelTexto}>Pontos: {pontuacao}</Text>
        <Text style={styles.painelTexto}>Tempo: {tempo}s</Text>
      </View>

      {nivelCompleto ? (
        <View style={styles.mensagem}>
          <Text style={styles.mensagemTexto}>
            Nível {nivel} concluído em {tempo}s!
          </Text>
          {nivel < 3 ? (
            <Pressable style={styles.botaoAcao} onPress={proximoNivel}>
              <Text style={styles.botaoAcaoTexto}>Próximo nível</Text>
            </Pressable>
          ) : (
            <>
              <Text style={styles.mensagemTexto}>
                Jogo finalizado! Pontuação final: {pontuacao}
              </Text>
              <Pressable style={styles.botaoAcao} onPress={reiniciar}>
                <Text style={styles.botaoAcaoTexto}>Jogar novamente</Text>
              </Pressable>
            </>
          )}
        </View>
      ) : (
        <>
          <View style={styles.grid}>
            {cartas.map(carta => (
              <CartaItem key={carta.id} carta={carta} onPress={() => virarCarta(carta.id)} />
            ))}
          </View>
          <Pressable style={styles.botaoReiniciar} onPress={reiniciarNivel}>
            <Text style={styles.botaoReiniciarTexto}>Reiniciar nível</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

const CORES = {
  fundo: '#eaf2ff',
  painel: '#1d4ed8',
  painelTexto: '#ffffff',
  texto: '#0f2a5c',
  verso: '#1d4ed8',
  versoTexto: '#ffffff',
  frente: '#ffffff',
  frenteBorda: '#bfd7ff',
  encontrada: '#dbeafe',
  encontradaBorda: '#3b82f6',
  errada: '#fee2e2',
  erradaBorda: '#f3a3a3',
  acao: '#1d4ed8',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CORES.fundo,
    paddingTop: 60,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  titulo: {
    fontSize: 24,
    fontWeight: '700',
    color: CORES.texto,
    marginBottom: 16,
  },
  painel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: CORES.painel,
    width: '100%',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
  },
  painelTexto: {
    fontWeight: '600',
    color: CORES.painelTexto,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    gap: 10,
  },
  cartaContainer: {
    width: '22%',
    aspectRatio: 1,
  },
  face: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backfaceVisibility: 'hidden',
    shadowColor: '#1d4ed8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  verso: {
    backgroundColor: CORES.verso,
  },
  frente: {
    backgroundColor: CORES.frente,
    borderWidth: 1.5,
    borderColor: CORES.frenteBorda,
  },
  frenteEncontrada: {
    backgroundColor: CORES.encontrada,
    borderColor: CORES.encontradaBorda,
  },
  frenteErrada: {
    backgroundColor: CORES.errada,
    borderColor: CORES.erradaBorda,
  },
  textoVerso: {
    fontSize: 22,
    fontWeight: '700',
    color: CORES.versoTexto,
  },
  textoFrente: {
    fontSize: 28,
  },
  mensagem: {
    marginTop: 30,
    alignItems: 'center',
    gap: 10,
  },
  mensagemTexto: {
    fontSize: 16,
    color: CORES.texto,
    textAlign: 'center',
  },
  botaoAcao: {
    backgroundColor: CORES.acao,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 8,
  },
  botaoAcaoTexto: {
    color: '#fff',
    fontSize: 16,
  },
  botaoReiniciar: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: CORES.acao,
  },
  botaoReiniciarTexto: {
    color: CORES.acao,
    fontWeight: '600',
  },
});
