import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { saveItem, getItem, StorageKeys } from '../utils/storage';
import {
  DEFAULT_NOTE_COLOR,
  normalizeNoteColor,
} from '../constants/noteColors';

export const loadNotes = createAsyncThunk('notes/loadNotes', async () => {
  return await getItem(StorageKeys.NOTES, []);
});

const sortNotes = notes => {
  notes.sort((a, b) => {
    const pinnedDifference =
      Number(Boolean(b.pinned)) - Number(Boolean(a.pinned));

    if (pinnedDifference !== 0) {
      return pinnedDifference;
    }

    return (b.updatedAt || 0) - (a.updatedAt || 0);
  });
};

const notesSlice = createSlice({
  name: 'notes',
  initialState: { list: [] },
  reducers: {
    saveNote: (state, action) => {
      const existingIndex = state.list.findIndex(
        n => n.id === action.payload.id,
      );
      const existingNote =
        existingIndex >= 0 ? state.list[existingIndex] : undefined;
      const noteToSave = {
        ...existingNote,
        ...action.payload,
        pinned:
          typeof action.payload.pinned === 'boolean'
            ? action.payload.pinned
            : Boolean(existingNote?.pinned),
        color: normalizeNoteColor(
          action.payload.color || existingNote?.color || DEFAULT_NOTE_COLOR,
        ),
      };

      if (existingIndex >= 0) {
        state.list[existingIndex] = noteToSave; // Update existing
      } else {
        state.list.unshift({
          ...noteToSave,
          pinned: Boolean(noteToSave.pinned),
        }); // Add new to top
      }
      sortNotes(state.list);
      saveItem(StorageKeys.NOTES, state.list);
    },
    deleteNote: (state, action) => {
      state.list = state.list.filter(note => note.id !== action.payload);
      saveItem(StorageKeys.NOTES, state.list);
    },
    togglePinNote: (state, action) => {
      const note = state.list.find(item => item.id === action.payload);

      if (note) {
        note.pinned = !note.pinned;
        sortNotes(state.list);
        saveItem(StorageKeys.NOTES, state.list);
      }
    },
  },
  extraReducers: builder => {
    builder.addCase(loadNotes.fulfilled, (state, action) => {
      state.list = action.payload.map(note => ({
        ...note,
        pinned: Boolean(note.pinned),
        color: normalizeNoteColor(note.color || DEFAULT_NOTE_COLOR),
      }));
      sortNotes(state.list);
    });
  },
});

export const { saveNote, deleteNote, togglePinNote } = notesSlice.actions;
export default notesSlice.reducer;
