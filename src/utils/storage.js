import AsyncStorage from '@react-native-async-storage/async-storage';

export const StorageKeys = {
  NOTES: '@notes_data',
  THEME: '@app_theme',
};

export const saveItem = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to save ${key}:`, error);
  }
};

export const getItem = async (key, defaultValue = null) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value !== null ? JSON.parse(value) : defaultValue;
  } catch (error) {
    console.error(`Failed to load ${key}:`, error);
    return defaultValue;
  }
};
