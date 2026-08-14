import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { supabase } from '../lib/supabase';

type Produto = {
  id: number;
  nome: string;
  preco: number;
  estoque: number;
};

export default function Home() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    buscarProdutos();
  }, []);

  async function buscarProdutos() {
    setCarregando(true);
    const { data, error } = await supabase.from('produtos').select('*');
    if (!error && data) setProdutos(data as Produto[]);
    setCarregando(false);
  }

  function renderItem({ item }: { item: Produto }) {
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

  return (
    <View style={styles.container}>
      <Text style={styles.header}>☕ MaisCafé</Text>
      <Text style={styles.subheader}>Nosso cardápio</Text>

      {carregando ? (
        <ActivityIndicator color="#6F4E37" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={produtos}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      )}
    </View>
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
    marginBottom: 20,
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
});
