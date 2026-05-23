import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { lightTheme, darkTheme } from '../constants/colors';

export default function EmptyState() {
  const isDark = useSelector(state => state.theme.isDark);
  const colors = isDark ? darkTheme : lightTheme;

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>📝</Text>
      <Text style={[styles.title, { color: colors.textMain }]}>
        Blank Canvas
      </Text>
      <Text style={[styles.subtitle, { color: colors.textSub }]}>
        Capture your best ideas. Tap + to begin.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '50%',
    paddingHorizontal: 40,
  },
  icon: { fontSize: 54, marginBottom: 20 },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});
