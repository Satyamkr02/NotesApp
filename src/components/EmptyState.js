import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { FileText, PenLine } from 'lucide-react-native';
import { lightTheme, darkTheme } from '../constants/colors';

export default function EmptyState() {
  const isDark = useSelector(state => state.theme.isDark);
  const colors = isDark ? darkTheme : lightTheme;
  const iconBackground = isDark ? '#1C1C1E' : '#FFFFFF';
  const iconBorder = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(28,28,30,0.06)';
  const lineColor = isDark ? 'rgba(255,255,255,0.16)' : 'rgba(28,28,30,0.10)';

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.mark,
          {
            backgroundColor: iconBackground,
            borderColor: iconBorder,
            shadowColor: colors.shadow,
          },
        ]}
      >
        <FileText size={38} color={colors.primary} strokeWidth={1.9} />
        <View style={styles.penBadge}>
          <PenLine size={18} color="#FFFFFF" strokeWidth={2.4} />
        </View>
      </View>

      <View style={styles.lines}>
        <View
          style={[styles.line, styles.lineWide, { backgroundColor: lineColor }]}
        />
        <View
          style={[
            styles.line,
            styles.lineShort,
            { backgroundColor: lineColor },
          ]}
        />
      </View>

      <Text style={[styles.title, { color: colors.textMain }]}>
        No Notes Yet
      </Text>
      <Text style={[styles.subtitle, { color: colors.textSub }]}>
        Start with a thought, a list, or one good line.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 500,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 34,
  },
  mark: {
    width: 96,
    height: 96,
    borderRadius: 32,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
  },
  penBadge: {
    position: 'absolute',
    right: -6,
    bottom: -6,
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A84FF',
  },
  lines: {
    alignItems: 'center',
    marginTop: 26,
    marginBottom: 22,
  },
  line: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  lineWide: {
    width: 148,
  },
  lineShort: {
    width: 96,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 0,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    maxWidth: 260,
    fontSize: 16,
    lineHeight: 23,
    textAlign: 'center',
  },
});
