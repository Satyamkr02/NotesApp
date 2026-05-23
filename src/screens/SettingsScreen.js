import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { toggleTheme } from '../redux/themeSlice';
import { lightTheme, darkTheme } from '../constants/colors';

export default function SettingsScreen({ navigation }) {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const isDark = useSelector(state => state.theme.isDark);
  const colors = isDark ? darkTheme : lightTheme;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Text style={[styles.backText, { color: colors.primary }]}>
            ← Back
          </Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textMain }]}>
          Settings
        </Text>
        <View style={styles.placeholder} />
      </View>

      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <Text style={[styles.rowLabel, { color: colors.textMain }]}>
          Dark Mode
        </Text>
        <Switch
          value={isDark}
          onValueChange={() => dispatch(toggleTheme())}
          trackColor={{ false: '#D1D1D6', true: colors.primary }}
          thumbColor="#FFF"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  backBtn: { width: 80, paddingVertical: 8 },
  backText: { fontSize: 17, fontWeight: '500' },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  placeholder: { width: 80 },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    padding: 18,
    borderRadius: 16,
  },
  rowLabel: { fontSize: 17, fontWeight: '500' },
});
