import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { scale, moderateScale } from 'react-native-size-matters';
import { ArrowUpToLine, Trash2 } from 'lucide-react-native';

export interface VideoControlsBarProps {
  paused: boolean;
  onPlayPause: () => void;
  onDelete: () => void;
  onUpload?: () => void;
  isLocalVideo: boolean;
  uploading: boolean;
  colors: {
    primary: string;
    text: string;
    notification: string;
  };
}

const VideoControlsBar: React.FC<VideoControlsBarProps> = ({
  paused,
  onPlayPause,
  onDelete,
  onUpload,
  isLocalVideo,
  uploading,
  colors,
}) => {
  return (
    <View style={styles.controlsBar}>
      <Pressable onPress={onDelete} style={styles.controlsIconBtn}>
        <Trash2 color={colors.notification} size={scale(28)} />
      </Pressable>
      <Pressable onPress={onPlayPause} style={styles.controlsIconBtn}>
        <Text style={{ color: colors.text, fontSize: moderateScale(32) }}>
          {paused ? '▶️' : '⏸'}
        </Text>
      </Pressable>
      {isLocalVideo && !uploading && onUpload && (
        <Pressable onPress={onUpload} style={styles.controlsIconBtn}>
          <ArrowUpToLine color={colors.primary} size={scale(28)} />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  controlsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: scale(15),
    borderRadius: scale(20),
    width: '100%',
  },
  controlsIconBtn: {
    padding: scale(10),
    borderRadius: scale(20),
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
});

export default VideoControlsBar;
