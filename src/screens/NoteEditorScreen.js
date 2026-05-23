import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { saveNote } from '../redux/notesSlice';
import { lightTheme, darkTheme } from '../constants/colors';
import {
  DEFAULT_NOTE_COLOR,
  NOTE_COLOR_OPTIONS,
  getNoteColorStyles,
} from '../constants/noteColors';
import { Check } from 'lucide-react-native';

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
  const [noteColor, setNoteColor] = useState(DEFAULT_NOTE_COLOR);
  const noteColorStyles = getNoteColorStyles(noteColor);

  useEffect(() => {
    if (existingNote) {
      setTitle(existingNote.title);
      setBody(existingNote.body);
      setNoteColor(existingNote.color || DEFAULT_NOTE_COLOR);
    } else {
      setTitle('');
      setBody('');
      setNoteColor(DEFAULT_NOTE_COLOR);
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
        pinned: Boolean(existingNote?.pinned),
        color: noteColor,
        updatedAt: Date.now(),
      }),
    );
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={[
        styles.container,
        { backgroundColor: noteColorStyles.background },
      ]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + 16,
            borderBottomColor: noteColorStyles.border,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.btn}
        >
          <Text style={[styles.cancelText, { color: noteColorStyles.textSub }]}>
            Cancel
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSave} style={styles.btn}>
          <Text style={[styles.saveText, { color: colors.primary }]}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        bounces={false}
        keyboardShouldPersistTaps="handled"
        showsHorizontalScrollIndicator={false}
        style={[
          styles.colorPicker,
          { borderBottomColor: noteColorStyles.border },
        ]}
        contentContainerStyle={styles.colorPickerContent}
      >
        {NOTE_COLOR_OPTIONS.map(option => {
          const optionStyles = getNoteColorStyles(option.color);
          const isSelected = noteColor === option.color;

          return (
            <TouchableOpacity
              key={option.color}
              activeOpacity={0.82}
              onPress={() => setNoteColor(option.color)}
              accessibilityLabel={`${option.name} note color`}
              style={[
                styles.colorSwatch,
                {
                  backgroundColor: optionStyles.background,
                  borderColor: isSelected
                    ? optionStyles.selectedBorder
                    : noteColorStyles.border,
                },
                isSelected && styles.colorSwatchSelected,
              ]}
            >
              {isSelected && (
                <Check
                  size={18}
                  color={optionStyles.textMain}
                  strokeWidth={3}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <TextInput
        style={[styles.titleInput, { color: noteColorStyles.textMain }]}
        placeholder="Note Title"
        placeholderTextColor={noteColorStyles.textPlaceholder}
        value={title}
        onChangeText={setTitle}
        autoFocus={!noteId}
      />

      <TextInput
        style={[styles.bodyInput, { color: noteColorStyles.textMain }]}
        placeholder="Start writing..."
        placeholderTextColor={noteColorStyles.textPlaceholder}
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
  colorPicker: {
    flexGrow: 0,
    height: 68,
    maxHeight: 68,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  colorPickerContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  colorSwatch: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  colorSwatchSelected: {
    borderWidth: 2,
  },
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
