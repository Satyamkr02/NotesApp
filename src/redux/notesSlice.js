import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { saveItem, getItem, StorageKeys } from '../utils/storage';

export const loadNotes = createAsyncThunk('notes/loadNotes', async () => {
  return await getItem(StorageKeys.NOTES, []);
});

const notesSlice = createSlice({
  name: 'notes',
  initialState: { list: [] },
  reducers: {
    saveNote: (state, action) => {
      const existingIndex = state.list.findIndex(
        n => n.id === action.payload.id,
      );
      if (existingIndex >= 0) {
        state.list[existingIndex] = action.payload; // Update existing
      } else {
        state.list.unshift(action.payload); // Add new to top
      }
      // Sort by newest first
      state.list.sort((a, b) => b.updatedAt - a.updatedAt);
      saveItem(StorageKeys.NOTES, state.list);
    },
    deleteNote: (state, action) => {
      state.list = state.list.filter(note => note.id !== action.payload);
      saveItem(StorageKeys.NOTES, state.list);
    },
  },
  extraReducers: builder => {
    builder.addCase(loadNotes.fulfilled, (state, action) => {
      state.list = action.payload;
    });
  },
});

export const { saveNote, deleteNote } = notesSlice.actions;
export default notesSlice.reducer;
