import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { scale, moderateScale } from 'react-native-size-matters';
import { Bar } from 'react-native-progress';

export interface VideoProgressBarProps {
  currentTime: number;
  duration: number;
  colors: {
    primary: string;
    text: string;
    border: string;
  };
}

// Format time to MM:SS format
const formatTime = (sec: number) => {
  const m = Math.floor(sec / 60)
    .toString()
    .padStart(2, '0');
  const s = Math.floor(sec % 60)
    .toString()
    .padStart(2, '0');
  return `${m}:${s}`;
};

const VideoProgressBar: React.FC<VideoProgressBarProps> = ({
  currentTime,
  duration,
  colors,
}) => {
  return (
    <View style={styles.progressBarRow}>
      <Text style={[styles.progressTime, { color: colors.text }]}>
        {formatTime(currentTime)}
      </Text>
      <View style={styles.progressBarBg}>
        <Bar
          progress={duration > 0 ? currentTime / duration : 0}
          color={colors.primary}
          unfilledColor={colors.border}
          borderWidth={0}
          height={scale(4)}
          width={null}
        />
      </View>
      <Text style={[styles.progressTime, { color: colors.text }]}>
        {formatTime(duration)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  progressBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  progressTime: {
    fontSize: moderateScale(12),
    minWidth: scale(40),
  },
  progressBarBg: {
    flex: 1,
    marginHorizontal: scale(10),
  },
});

export default VideoProgressBar;
