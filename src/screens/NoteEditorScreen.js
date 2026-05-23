import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { saveNote } from '../redux/notesSlice';
import { lightTheme, darkTheme } from '../constants/colors';

export default function NoteEditorScreen({ route, navigation }) {
  const { noteId } = route.params || {};
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

  const isDark = useSelector(state => state.theme.isDark);
  const colors = isDark ? darkTheme : lightTheme;

  const existingNote = useSelector(state =>
    state.notes.list.find(n => n.id === noteId),
  );

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  useEffect(() => {
    if (existingNote) {
      setTitle(existingNote.title);
      setBody(existingNote.body);
    }
  }, [existingNote]);

  const handleSave = () => {
    if (!title.trim() && !body.trim()) {
      navigation.goBack();
      return;
    }

    dispatch(
      saveNote({
        id: existingNote ? existingNote.id : Date.now().toString(),
        title: title.trim(),
        body: body.trim(),
        updatedAt: Date.now(),
      }),
    );
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.surface }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View
        style={[
          styles.header,
          { paddingTop: insets.top + 16, borderBottomColor: colors.border },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.btn}
        >
          <Text style={[styles.cancelText, { color: colors.textSub }]}>
            Cancel
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSave} style={styles.btn}>
          <Text style={[styles.saveText, { color: colors.primary }]}>Save</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={[styles.titleInput, { color: colors.textMain }]}
        placeholder="Note Title"
        placeholderTextColor={colors.textPlaceholder}
        value={title}
        onChangeText={setTitle}
        autoFocus={!noteId}
      />

      <TextInput
        style={[styles.bodyInput, { color: colors.textMain }]}
        placeholder="Start writing..."
        placeholderTextColor={colors.textPlaceholder}
        value={body}
        onChangeText={setBody}
        multiline
        textAlignVertical="top"
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  btn: { padding: 8 },
  cancelText: { fontSize: 17 },
  saveText: { fontSize: 17, fontWeight: '700' },
  titleInput: {
    fontSize: 28,
    fontWeight: '700',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 12,
  },
  bodyInput: {
    flex: 1,
    fontSize: 17,
    lineHeight: 26,
    paddingHorizontal: 24,
    paddingTop: 12,
  },
});
