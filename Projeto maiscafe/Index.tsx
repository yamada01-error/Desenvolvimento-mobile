import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { supabase } from '../lib/supabase';

type Produto = {
  id: number;
  nome: string;
  preco: number;
  estoque: number;
};

type Mesa = {
  id: number;
  nome: string;
  disponivel: boolean;
};

export default function Home() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [mesas, setMesas] = useState<Mesa[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    buscarDados();
  }, []);

  async function buscarDados() {
    setCarregando(true);
    const [produtosRes, mesasRes] = await Promise.all([
      supabase.from('produtos').select('*'),
      supabase.from('mesas').select('*'),
    ]);
    if (!produtosRes.error && produtosRes.data) setProdutos(produtosRes.data as Produto[]);
    if (!mesasRes.error && mesasRes.data) setMesas(mesasRes.data as Mesa[]);
    setCarregando(false);
  }

  function renderProduto({ item }: { item: Produto }) {
    const emFalta = item.estoque <= 0;
    return (
      <View style={styles.card}>
        <View style={{ flex: 1 }}>
          <Text style={styles.nome}>{item.nome}</Text>
          <Text style={styles.preco}>R$ {item.preco.toFixed(2)}</Text>
        </View>
        {emFalta ? (
          <View style={styles.badgeFalta}>
            <Text style={styles.badgeFaltaText}>Em falta</Text>
          </View>
        ) : (
          <View style={styles.badgeOk}>
            <Text style={styles.badgeOkText}>Disponível</Text>
          </View>
        )}
      </View>
    );
  }

  function renderMesa({ item }: { item: Mesa }) {
    return (
      <View style={styles.mesaCard}>
        <Text
          style={[
            styles.mesaNome,
            { color: item.disponivel ? '#2E7D32' : '#C62828' },
          ]}
        >
          {item.nome}
        </Text>
        <Text style={styles.mesaStatus}>
          {item.disponivel ? 'Disponível' : 'Ocupada'}
        </Text>
      </View>
    );
  }

  if (carregando) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color="#6F4E37" style={{ marginTop: 60 }} />
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 24 }}
      data={produtos}
      keyExtractor={(item) => String(item.id)}
      renderItem={renderProduto}
      ListHeaderComponent={
        <>
          <Text style={styles.header}>☕ MaisCafé</Text>

          <Text style={styles.subheader}>Mesas do estabelecimento</Text>
          <FlatList
            data={mesas}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderMesa}
            numColumns={2}
            columnWrapperStyle={{ gap: 12 }}
            contentContainerStyle={{ gap: 12, marginBottom: 24 }}
            scrollEnabled={false}
          />

          <Text style={styles.subheader}>Nosso cardápio</Text>
        </>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5EBDD',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4E342E',
  },
  subheader: {
    fontSize: 14,
    color: '#8D6E63',
    marginBottom: 12,
    marginTop: 4,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#4E342E',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  nome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4E342E',
  },
  preco: {
    fontSize: 14,
    color: '#8D6E63',
    marginTop: 4,
  },
  badgeOk: {
    backgroundColor: '#DDEBD8',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeOkText: {
    color: '#4C7A4C',
    fontSize: 12,
    fontWeight: '600',
  },
  badgeFalta: {
    backgroundColor: '#F4D9D0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeFaltaText: {
    color: '#B5482B',
    fontSize: 12,
    fontWeight: '600',
  },
  mesaCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 20,
    shadowColor: '#4E342E',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  mesaNome: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  mesaStatus: {
    fontSize: 12,
    color: '#8D6E63',
    marginTop: 4,
  },
});