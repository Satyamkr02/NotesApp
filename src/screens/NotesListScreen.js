import React, { useEffect } from 'react';
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

export default function NotesListScreen({ navigation }) {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const notes = useSelector(state => state.notes.list);
  const isDark = useSelector(state => state.theme.isDark);
  const colors = isDark ? darkTheme : lightTheme;

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
        data={notes}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <NoteCard
            note={item}
            onPress={() =>
              navigation.navigate('NoteEditor', { noteId: item.id })
            }
          />
        )}
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
