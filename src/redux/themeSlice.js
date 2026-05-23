import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { saveItem, getItem, StorageKeys } from '../utils/storage';

export const loadTheme = createAsyncThunk('theme/loadTheme', async () => {
  return await getItem(StorageKeys.THEME, false); // false = light mode
});

const themeSlice = createSlice({
  name: 'theme',
  initialState: { isDark: false },
  reducers: {
    toggleTheme: state => {
      state.isDark = !state.isDark;
      saveItem(StorageKeys.THEME, state.isDark);
    },
  },
  extraReducers: builder => {
    builder.addCase(loadTheme.fulfilled, (state, action) => {
      state.isDark = action.payload;
    });
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
