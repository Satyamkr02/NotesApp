export const DEFAULT_NOTE_COLOR = '#FFFFFF';

export const NOTE_COLOR_OPTIONS = [
  { name: 'White', color: DEFAULT_NOTE_COLOR },
  { name: 'Lemon', color: '#FFF3B0' },
  { name: 'Mint', color: '#D9F8C4' },
  { name: 'Sky', color: '#D8ECFF' },
  { name: 'Lavender', color: '#E9DDFF' },
  { name: 'Rose', color: '#FFDDE8' },
  { name: 'Peach', color: '#FFE1B8' },
  { name: 'Ink', color: '#242633' },
];

export const normalizeNoteColor = color => {
  if (typeof color !== 'string') {
    return DEFAULT_NOTE_COLOR;
  }

  const trimmedColor = color.trim();
  return /^#[0-9A-Fa-f]{6}$/.test(trimmedColor)
    ? trimmedColor.toUpperCase()
    : DEFAULT_NOTE_COLOR;
};

const hexToRgb = color => {
  const normalizedColor = normalizeNoteColor(color);
  const value = normalizedColor.slice(1);

  return {
    red: parseInt(value.slice(0, 2), 16),
    green: parseInt(value.slice(2, 4), 16),
    blue: parseInt(value.slice(4, 6), 16),
  };
};

const getLuminance = color => {
  const { red, green, blue } = hexToRgb(color);
  const channels = [red, green, blue].map(channel => {
    const normalizedChannel = channel / 255;

    return normalizedChannel <= 0.03928
      ? normalizedChannel / 12.92
      : Math.pow((normalizedChannel + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
};

export const getNoteColorStyles = color => {
  const background = normalizeNoteColor(color);
  const isDark = getLuminance(background) < 0.42;

  return {
    background,
    textMain: isDark ? '#FFFFFF' : '#1C1C1E',
    textSub: isDark ? 'rgba(255,255,255,0.72)' : '#8E8E93',
    textPlaceholder: isDark ? 'rgba(255,255,255,0.48)' : 'rgba(28,28,30,0.36)',
    border: isDark ? 'rgba(255,255,255,0.16)' : 'rgba(28,28,30,0.08)',
    selectedBorder: isDark ? '#FFFFFF' : '#1C1C1E',
    isDark,
  };
};
