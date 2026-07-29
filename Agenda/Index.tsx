import { useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

type Category = 'trabalho' | 'estudo' | 'pessoal' | 'saude';

type Appointment = {
  id: number;
  title: string;
  date: string;
  time: string;
  category: Category;
  done: boolean;
};

const CATEGORY_LABELS: Record<Category, string> = {
  trabalho: 'Trabalho',
  estudo: 'Estudo',
  pessoal: 'Pessoal',
  saude: 'Saúde',
};

const CATEGORY_COLORS: Record<Category, string> = {
  trabalho: '#2563eb',
  estudo: '#7c3aed',
  pessoal: '#0d9488',
  saude: '#dc2626',
};

const CATEGORY_OPTIONS: Category[] = ['trabalho', 'estudo', 'pessoal', 'saude'];

let nextId = 4;

const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 1,
    title: 'Reunião com orientador',
    date: '29/07',
    time: '09:00',
    category: 'trabalho',
    done: false,
  },
  {
    id: 2,
    title: 'Estudar para a prova de redes',
    date: '29/07',
    time: '14:30',
    category: 'estudo',
    done: false,
  },
  {
    id: 3,
    title: 'Consulta com dentista',
    date: '30/07',
    time: '11:00',
    category: 'saude',
    done: false,
  },
];

function sortAppointments(list: Appointment[]): Appointment[] {
  return [...list].sort((a, b) => {
    if (a.date === b.date) {
      return a.time.localeCompare(b.time);
    }
    return a.date.localeCompare(b.date);
  });
}

export default function Index() {
  const [appointments, setAppointments] = useState<Appointment[]>(() =>
    sortAppointments(INITIAL_APPOINTMENTS),
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [category, setCategory] = useState<Category>('trabalho');

  const totalCount = appointments.length;
  const doneCount = useMemo(
    () => appointments.filter((item) => item.done).length,
    [appointments],
  );
  const nextAppointment = useMemo(
    () => appointments.find((item) => !item.done),
    [appointments],
  );

  function openNewAppointmentModal() {
    setTitle('');
    setDate('');
    setTime('');
    setCategory('trabalho');
    setIsModalVisible(true);
  }

  function closeModal() {
    setIsModalVisible(false);
  }

  function handleSaveAppointment() {
    if (title.trim() === '' || date.trim() === '' || time.trim() === '') {
      return;
    }
    const newAppointment: Appointment = {
      id: nextId,
      title: title.trim(),
      date: date.trim(),
      time: time.trim(),
      category,
      done: false,
    };
    nextId += 1;
    setAppointments((currentAppointments) =>
      sortAppointments([...currentAppointments, newAppointment]),
    );
    setIsModalVisible(false);
  }

  function toggleDone(id: number) {
    setAppointments((currentAppointments) =>
      currentAppointments.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item,
      ),
    );
  }

  function removeAppointment(id: number) {
    setAppointments((currentAppointments) =>
      currentAppointments.filter((item) => item.id !== id),
    );
  }

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={styles.screenContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Minha Agenda</Text>
          <Text style={styles.subtitle}>Organize seus compromissos do dia</Text>
        </View>

        <View style={styles.scoreboard}>
          <View style={styles.scoreItem}>
            <Text style={styles.scoreLabel}>Total</Text>
            <Text style={styles.scoreValue}>{totalCount}</Text>
          </View>
          <View style={styles.scoreItem}>
            <Text style={styles.scoreLabel}>Concluídos</Text>
            <Text style={styles.scoreValue}>{doneCount}</Text>
          </View>
          <View style={styles.scoreItem}>
            <Text style={styles.scoreLabel}>Próximo</Text>
            <Text style={styles.scoreValueSmall}>
              {nextAppointment ? nextAppointment.time : '--:--'}
            </Text>
          </View>
        </View>

        <FlatList
          data={appointments}
          keyExtractor={(item) => String(item.id)}
          scrollEnabled={false}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              Nenhum compromisso cadastrado. Toque em "Novo compromisso" para
              começar.
            </Text>
          }
          renderItem={({ item }) => (
            <View
              style={[
                styles.card,
                item.done && styles.cardDone,
                { borderLeftColor: CATEGORY_COLORS[item.category] },
              ]}
            >
              <Pressable
                accessibilityRole="checkbox"
                accessibilityState={{ checked: item.done }}
                onPress={() => toggleDone(item.id)}
                style={styles.cardMain}
              >
                <View style={[styles.checkbox, item.done && styles.checkboxChecked]}>
                  {item.done && <Text style={styles.checkboxMark}>✓</Text>}
                </View>
                <View style={styles.cardInfo}>
                  <Text style={[styles.cardTitle, item.done && styles.cardTitleDone]}>
                    {item.title}
                  </Text>
                  <Text style={styles.cardMeta}>{item.date} às {item.time}</Text>
                  <View style={[styles.categoryTag, { backgroundColor: CATEGORY_COLORS[item.category] }]}>
                    <Text style={styles.categoryTagText}>{CATEGORY_LABELS[item.category]}</Text>
                  </View>
                </View>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Remover ${item.title}`}
                onPress={() => removeAppointment(item.id)}
                style={({ pressed }) => [styles.removeButton, pressed && styles.removeButtonPressed]}
              >
                <Text style={styles.removeButtonText}>✕</Text>
              </Pressable>
            </View>
          )}
        />

        <Pressable
          accessibilityRole="button"
          onPress={openNewAppointmentModal}
          style={({ pressed }) => [styles.addButton, pressed && styles.addButtonPressed]}
        >
          <Text style={styles.addButtonText}>+ Novo compromisso</Text>
        </Pressable>
      </ScrollView>

      <Modal visible={isModalVisible} transparent animationType="fade" onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Novo compromisso</Text>

            <Text style={styles.fieldLabel}>Título</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Ex: Reunião de projeto"
              style={styles.input}
            />

            <Text style={styles.fieldLabel}>Data</Text>
            <TextInput
              value={date}
              onChangeText={setDate}
              placeholder="Ex: 31/07"
              style={styles.input}
            />

            <Text style={styles.fieldLabel}>Horário</Text>
            <TextInput
              value={time}
              onChangeText={setTime}
              placeholder="Ex: 15:30"
              style={styles.input}
            />

            <Text style={styles.fieldLabel}>Categoria</Text>
            <View style={styles.categoryRow}>
              {CATEGORY_OPTIONS.map((option) => (
                <Pressable
                  key={option}
                  onPress={() => setCategory(option)}
                  style={[
                    styles.categoryOption,
                    { borderColor: CATEGORY_COLORS[option] },
                    category === option && { backgroundColor: CATEGORY_COLORS[option] },
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryOptionText,
                      category === option && styles.categoryOptionTextActive,
                    ]}
                  >
                    {CATEGORY_LABELS[option]}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.modalActions}>
              <Pressable
                onPress={closeModal}
                style={({ pressed }) => [styles.cancelButton, pressed && styles.cancelButtonPressed]}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </Pressable>
              <Pressable
                onPress={handleSaveAppointment}
                style={({ pressed }) => [styles.saveButton, pressed && styles.saveButtonPressed]}
              >
                <Text style={styles.saveButtonText}>Salvar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f4f5f7',
  },
  screenContent: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  scoreboard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  scoreItem: {
    flex: 1,
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  scoreValueSmall: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  list: {
    gap: 10,
  },
  emptyText: {
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: 14,
    marginTop: 20,
    paddingHorizontal: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  cardDone: {
    opacity: 0.6,
  },
  cardMain: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  checkboxMark: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  cardTitleDone: {
    textDecorationLine: 'line-through',
    color: '#9ca3af',
  },
  cardMeta: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  categoryTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    marginTop: 6,
  },
  categoryTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#ffffff',
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  removeButtonPressed: {
    backgroundColor: '#fee2e2',
  },
  removeButtonText: {
    color: '#dc2626',
    fontSize: 16,
    fontWeight: '700',
  },
  addButton: {
    backgroundColor: '#111827',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  addButtonPressed: {
    opacity: 0.85,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginTop: 10,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  categoryOption: {
    borderWidth: 1.5,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  categoryOptionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  categoryOptionTextActive: {
    color: '#ffffff',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 20,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  cancelButtonPressed: {
    backgroundColor: '#f3f4f6',
  },
  cancelButtonText: {
    color: '#6b7280',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#111827',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  saveButtonPressed: {
    opacity: 0.85,
  },
  saveButtonText: {
    color: '#ffffff',
    fontWeight: '700',
  },
});
