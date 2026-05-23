import React, { useEffect, useRef } from 'react';
import {
  Alert,
  Animated,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Pencil, Pin, PinOff, Trash2 } from 'lucide-react-native';
import { deleteNote, togglePinNote } from '../redux/notesSlice';
import { lightTheme, darkTheme } from '../constants/colors';
import { getNoteColorStyles } from '../constants/noteColors';

const ACTION_BUTTON_WIDTH = 64;
const ACTION_GAP = 8;
const ACTIONS_WIDTH = (ACTION_BUTTON_WIDTH + ACTION_GAP) * 3;
const PIN_COLOR = '#FF9500';

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const getPreviewDetails = body => {
  const trimmedBody = body?.trim();

  if (!trimmedBody) {
    return {
      text: 'No additional text...',
      hiddenLineCount: 0,
    };
  }

  const bodyLines = trimmedBody
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean);
  const previewLines = bodyLines.slice(0, 2);

  return {
    text: previewLines.length > 0 ? previewLines.join('\n') : trimmedBody,
    hiddenLineCount: Math.max(bodyLines.length - previewLines.length, 0),
  };
};

function ActionButton({
  label,
  Icon,
  color,
  labelColor,
  progress,
  shift,
  scale,
  onPress,
}) {
  return (
    <Animated.View
      style={[
        styles.actionItem,
        {
          opacity: progress,
          transform: [{ translateX: shift }, { scale }],
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.78}
        onPress={onPress}
        style={[styles.actionButton, { backgroundColor: color }]}
      >
        <Icon size={23} color="#FFFFFF" strokeWidth={2.4} />
      </TouchableOpacity>
      <Text style={[styles.actionLabel, { color: labelColor }]}>{label}</Text>
    </Animated.View>
  );
}

export default function NoteCard({ note, onPress, onEdit }) {
  const dispatch = useDispatch();
  const isDark = useSelector(state => state.theme.isDark);
  const colors = isDark ? darkTheme : lightTheme;
  const noteColorStyles = getNoteColorStyles(note.color);

  const pan = useRef(new Animated.Value(0)).current;
  const currentPanValue = useRef(0);
  const gestureStartX = useRef(0);

  const actionProgress = pan.interpolate({
    inputRange: [-ACTIONS_WIDTH, -42, 0],
    outputRange: [1, 0.88, 0],
    extrapolate: 'clamp',
  });
  const actionShift = pan.interpolate({
    inputRange: [-ACTIONS_WIDTH, 0],
    outputRange: [0, 20],
    extrapolate: 'clamp',
  });
  const actionScale = actionProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.92, 1],
    extrapolate: 'clamp',
  });
  const cardScale = pan.interpolate({
    inputRange: [-ACTIONS_WIDTH, 0],
    outputRange: [0.985, 1],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    const listener = pan.addListener(({ value }) => {
      currentPanValue.current = value;
    });

    return () => {
      pan.removeListener(listener);
    };
  }, [pan]);

  const animateTo = (toValue, onComplete) => {
    Animated.spring(pan, {
      toValue,
      useNativeDriver: true,
      friction: 8,
      tension: 55,
    }).start(({ finished }) => {
      if (finished && onComplete) {
        onComplete();
      }
    });
  };

  const closeActions = onComplete => {
    animateTo(0, onComplete);
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) =>
        Math.abs(gestureState.dx) > 12 &&
        Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 1.1,
      onPanResponderGrant: () => {
        pan.stopAnimation(value => {
          currentPanValue.current = value;
          gestureStartX.current = value;
          pan.setValue(value);
        });
      },
      onPanResponderMove: (evt, gestureState) => {
        const nextValue = clamp(
          gestureStartX.current + gestureState.dx,
          -ACTIONS_WIDTH,
          0,
        );

        pan.setValue(nextValue);
      },
      onPanResponderRelease: (evt, gestureState) => {
        const finalX = clamp(
          gestureStartX.current + gestureState.dx,
          -ACTIONS_WIDTH,
          0,
        );
        const shouldOpen =
          gestureState.vx < -0.55 || finalX < -ACTIONS_WIDTH / 2;
        const shouldClose =
          gestureState.vx > 0.55 || finalX > -ACTIONS_WIDTH / 2;

        animateTo(shouldOpen && !shouldClose ? -ACTIONS_WIDTH : 0);
      },
      onPanResponderTerminate: () => {
        animateTo(
          currentPanValue.current < -ACTIONS_WIDTH / 2 ? -ACTIONS_WIDTH : 0,
        );
      },
    }),
  ).current;

  const formatDateTime = timestamp => {
    const date = timestamp ? new Date(timestamp) : new Date();
    const dateString = date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
    const timeString = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
    return `${dateString} • ${timeString}`;
  };

  const handleCardPress = () => {
    if (currentPanValue.current < -10) {
      closeActions();
      return;
    }

    onPress?.();
  };

  const handleEdit = () => {
    closeActions(onEdit || onPress);
  };

  const handlePinToggle = () => {
    closeActions(() => dispatch(togglePinNote(note.id)));
  };

  const handleDelete = () => {
    Alert.alert('Delete Note', 'This note will be permanently removed.', [
      {
        text: 'Cancel',
        style: 'cancel',
        onPress: () => closeActions(),
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => dispatch(deleteNote(note.id)),
      },
    ]);
  };

  const PinActionIcon = note.pinned ? PinOff : Pin;
  const preview = getPreviewDetails(note.body);

  return (
    <View style={styles.cardContainer}>
      <View style={styles.actionsRail}>
        <ActionButton
          label="Edit"
          Icon={Pencil}
          color={colors.primary}
          labelColor={colors.textSub}
          progress={actionProgress}
          shift={actionShift}
          scale={actionScale}
          onPress={handleEdit}
        />
        <ActionButton
          label={note.pinned ? 'Unpin' : 'Pin'}
          Icon={PinActionIcon}
          color={PIN_COLOR}
          labelColor={colors.textSub}
          progress={actionProgress}
          shift={actionShift}
          scale={actionScale}
          onPress={handlePinToggle}
        />
        <ActionButton
          label="Delete"
          Icon={Trash2}
          color={colors.danger || '#FF3B30'}
          labelColor={colors.textSub}
          progress={actionProgress}
          shift={actionShift}
          scale={actionScale}
          onPress={handleDelete}
        />
      </View>

      <Animated.View
        style={[
          styles.card,
          {
            backgroundColor: noteColorStyles.background,
            borderColor: noteColorStyles.border,
            shadowColor: colors.shadow,
            transform: [{ translateX: pan }, { scale: cardScale }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity
          activeOpacity={0.94}
          onPress={handleCardPress}
          style={styles.cardTouch}
        >
          <View style={styles.content}>
            <View style={styles.titleRow}>
              <Text
                style={[styles.title, { color: noteColorStyles.textMain }]}
                numberOfLines={1}
              >
                {note.title || 'Untitled'}
              </Text>
              {note.pinned && (
                <Pin
                  size={17}
                  color={PIN_COLOR}
                  strokeWidth={2.6}
                  style={styles.pinIcon}
                />
              )}
            </View>
            <Text
              style={[styles.preview, { color: noteColorStyles.textSub }]}
              numberOfLines={2}
            >
              {preview.text}
            </Text>
            {preview.hiddenLineCount > 0 && (
              <Text
                style={[styles.moreText, { color: noteColorStyles.textSub }]}
              >
                +{preview.hiddenLineCount} more{' '}
                {preview.hiddenLineCount === 1 ? 'line' : 'lines'}
              </Text>
            )}
          </View>

          <View
            style={[styles.footer, { borderTopColor: noteColorStyles.border }]}
          >
            <Text
              style={[styles.dateText, { color: noteColorStyles.textSub }]}
              numberOfLines={1}
            >
              {formatDateTime(note.updatedAt)}
            </Text>
            {note.pinned && (
              <View
                style={[
                  styles.pinnedBadge,
                  noteColorStyles.isDark
                    ? styles.pinnedBadgeDark
                    : styles.pinnedBadgeLight,
                ]}
              >
                <Pin size={12} color={PIN_COLOR} strokeWidth={2.6} />
                <Text style={styles.pinnedText}>Pinned</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 16,
    position: 'relative',
  },
  actionsRail: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: ACTIONS_WIDTH,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  actionItem: {
    width: ACTION_BUTTON_WIDTH,
    alignItems: 'center',
    marginLeft: ACTION_GAP,
  },
  actionButton: {
    width: ACTION_BUTTON_WIDTH,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
  },
  card: {
    borderRadius: 28,
    borderWidth: 1,
    elevation: 2,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
  },
  cardTouch: {
    borderRadius: 28,
    overflow: 'hidden',
  },
  content: {
    minHeight: 124,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 22,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    flex: 1,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0,
  },
  pinIcon: {
    marginLeft: 8,
  },
  preview: {
    fontSize: 17,
    lineHeight: 25,
  },
  moreText: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  dateText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.2,
    marginRight: 12,
  },
  pinnedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  pinnedBadgeLight: {
    backgroundColor: 'rgba(255,149,0,0.12)',
  },
  pinnedBadgeDark: {
    backgroundColor: 'rgba(255,149,0,0.18)',
  },
  pinnedText: {
    color: PIN_COLOR,
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 4,
  },
});
