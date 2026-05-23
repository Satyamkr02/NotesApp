import React, { useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Settings, Plus } from 'lucide-react-native';
import { loadNotes } from '../redux/notesSlice';
import { loadTheme } from '../redux/themeSlice';
import NoteCard from '../components/NoteCard';
import EmptyState from '../components/EmptyState';
import { lightTheme, darkTheme } from '../constants/colors';

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const startOfDay = date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

const getSectionForNote = note => {
  const savedAt = new Date(note.updatedAt || Date.now());
  const now = new Date();
  const savedDay = startOfDay(savedAt);
  const today = startOfDay(now);
  const yesterday = today - 24 * 60 * 60 * 1000;

  if (savedDay === today) {
    return { key: 'today', title: 'Today' };
  }

  if (savedDay === yesterday) {
    return { key: 'yesterday', title: 'Yesterday' };
  }

  if (savedAt.getFullYear() === now.getFullYear()) {
    const month = savedAt.getMonth();

    return {
      key: `month-${month}`,
      title: MONTH_NAMES[month],
    };
  }

  const year = savedAt.getFullYear();

  return { key: `year-${year}`, title: String(year) };
};

const buildListRows = notes => {
  const rows = [];
  const pinnedNotes = notes.filter(note => note.pinned);
  const regularNotes = notes.filter(note => !note.pinned);
  const shownSections = new Set();

  if (pinnedNotes.length > 0) {
    rows.push({ type: 'header', id: 'section-pinned', title: 'Pinned' });
    pinnedNotes.forEach(note => {
      rows.push({ type: 'note', id: note.id, note });
    });
  }

  regularNotes.forEach(note => {
    const section = getSectionForNote(note);

    if (!shownSections.has(section.key)) {
      shownSections.add(section.key);
      rows.push({
        type: 'header',
        id: `section-${section.key}`,
        title: section.title,
      });
    }

    rows.push({ type: 'note', id: note.id, note });
  });

  return rows;
};

export default function NotesListScreen({ navigation }) {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const notes = useSelector(state => state.notes.list);
  const isDark = useSelector(state => state.theme.isDark);
  const colors = isDark ? darkTheme : lightTheme;
  const listRows = useMemo(() => buildListRows(notes), [notes]);

  useEffect(() => {
    dispatch(loadTheme());
    dispatch(loadNotes());
  }, [dispatch]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Custom Header for identical iOS/Android look */}
      <View
        style={[
          styles.header,
          { paddingTop: insets.top + 16, backgroundColor: colors.background },
        ]}
      >
        <Text style={[styles.headerTitle, { color: colors.textMain }]}>
          Notes
        </Text>
        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: colors.surface }]}
          onPress={() => navigation.navigate('Settings')}
        >
          <Settings size={22} color={colors.textMain} strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={listRows}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          if (item.type === 'header') {
            return (
              <Text style={[styles.sectionTitle, { color: colors.textMain }]}>
                {item.title}
              </Text>
            );
          }

          return (
            <NoteCard
              note={item.note}
              onPress={() =>
                navigation.navigate('NoteEditor', { noteId: item.note.id })
              }
              onEdit={() =>
                navigation.navigate('NoteEditor', { noteId: item.note.id })
              }
            />
          );
        }}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<EmptyState />}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        style={[
          styles.fab,
          { backgroundColor: colors.primary, shadowColor: colors.primary },
        ]}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('NoteEditor')}
      >
        <Plus size={28} color="#FFFFFF" strokeWidth={2.5} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  headerTitle: { fontSize: 34, fontWeight: '700', letterSpacing: -0.5 },
  iconButton: {
    padding: 10,
    borderRadius: 14,
  },
  listContent: { paddingHorizontal: 20, paddingBottom: 120, paddingTop: 10 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
    marginTop: 14,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 40,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
});
