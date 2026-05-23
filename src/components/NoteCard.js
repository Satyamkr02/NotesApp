import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Trash2, Pencil } from 'lucide-react-native';
import { deleteNote } from '../redux/notesSlice';
import { lightTheme, darkTheme } from '../constants/colors';

export default function NoteCard({ note, onPress }) {
  const dispatch = useDispatch();
  const isDark = useSelector(state => state.theme.isDark);
  const colors = isDark ? darkTheme : lightTheme;

  const formatDateTime = timestamp => {
    const date = timestamp ? new Date(timestamp) : new Date();
    const dateString = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    const timeString = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
    return `${dateString} • ${timeString}`;
  };

  const handleDelete = () => {
    Alert.alert('Delete Note', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => dispatch(deleteNote(note.id)),
      },
    ]);
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: colors.surface, shadowColor: colors.shadow },
      ]}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={styles.content}>
        <Text
          style={[styles.title, { color: colors.textMain }]}
          numberOfLines={1}
        >
          {note.title || 'Untitled'}
        </Text>
        <Text
          style={[styles.preview, { color: colors.textSub }]}
          numberOfLines={3}
        >
          {note.body || 'No additional text...'}
        </Text>
      </View>

      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <Text style={[styles.dateText, { color: colors.textSub }]}>
          {formatDateTime(note.updatedAt)}
        </Text>

        <View style={styles.actionGroup}>
          <TouchableOpacity
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            onPress={onPress}
            style={styles.iconBtn}
          >
            <Pencil size={18} color={colors.textSub} strokeWidth={2.5} />
          </TouchableOpacity>
          <TouchableOpacity
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            onPress={handleDelete}
            style={styles.iconBtn}
          >
            <Trash2 size={18} color={colors.textSub} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    elevation: 2,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
  },
  content: {
    padding: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.4,
    marginBottom: 8,
  },
  preview: {
    fontSize: 15,
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  dateText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  actionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    marginLeft: 16,
  },
});
