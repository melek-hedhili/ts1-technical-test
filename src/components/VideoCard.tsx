import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { scale, moderateScale } from 'react-native-size-matters';
import { useTheme } from '@react-navigation/native';
import { Play, Trash2, Upload } from 'lucide-react-native';
import {
  getVideoFileSize,
  formatVideoDuration,
} from '../services/local-videos';
import { formatBytes } from '../utils/formatters';
import { extractFilename } from '../utils/validators';
import { VideoCardProps, LocalVideo, RemoteVideo } from '../types';

const VideoCard: React.FC<VideoCardProps> = ({
  video,
  isRemote = false,
  onPlay,
  onDelete,
  onUpload,
  showUploadButton = false,
}) => {
  const { colors } = useTheme();
  const [videoSize, setVideoSize] = useState<string | null>(null);

  // Get video name from path or remote name
  const getVideoName = () => {
    if (isRemote) {
      return (video as RemoteVideo).name;
    }
    // For local videos, extract filename from path
    const path = (video as LocalVideo).path;
    return extractFilename(path);
  };

  useEffect(() => {
    if (!isRemote) {
      getVideoFileSize((video as LocalVideo).path).then(setVideoSize);
    }
  }, [video, isRemote]);

  // Get formatted video duration
  const getVideoDuration = () => {
    if (isRemote) return null;
    const duration = (video as LocalVideo).duration;
    return formatVideoDuration(duration);
  };

  // Handle delete confirmation
  const handleDelete = () => {
    Alert.alert(
      'Delete Video',
      `Are you sure you want to delete "${getVideoName()}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete(video),
        },
      ],
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      {/* Video Preview */}
      <View style={styles.previewWrapper}>
        <TouchableOpacity
          style={[styles.previewContainer, { backgroundColor: colors.border }]}
          onPress={() => onPlay(video)}
        >
          <View style={styles.playButton}>
            <Play
              color={colors.primary}
              size={scale(24)}
              fill={colors.primary}
            />
          </View>
        </TouchableOpacity>
      </View>

      {/* Video Details and Actions */}
      <View style={styles.detailsContainer}>
        <View style={styles.infoRow}>
          <Text
            style={[styles.videoName, { color: colors.text }]}
            numberOfLines={2}
          >
            {getVideoName()}
          </Text>
        </View>

        <View style={styles.metadataRow}>
          <View style={styles.metadataInfo}>
            {!isRemote && (
              <>
                {getVideoDuration() && (
                  <Text style={[styles.metadata, { color: colors.text }]}>
                    {getVideoDuration()}
                  </Text>
                )}
                {videoSize && (
                  <Text style={[styles.metadata, { color: colors.text }]}>
                    {videoSize}
                  </Text>
                )}
              </>
            )}
            {isRemote && (
              <>
                <Text style={[styles.metadata, { color: colors.text }]}>
                  Remote Video
                </Text>
                {formatBytes((video as RemoteVideo).metadata?.size) && (
                  <Text style={[styles.metadata, { color: colors.text }]}>
                    {formatBytes((video as RemoteVideo).metadata?.size)}
                  </Text>
                )}
              </>
            )}
          </View>
          <View style={styles.actionButtonsRow}>
            {showUploadButton && onUpload && !isRemote && (
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  { backgroundColor: colors.primary },
                ]}
                onPress={() => onUpload(video as LocalVideo)}
              >
                <Upload color="white" size={scale(16)} />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: colors.notification, marginLeft: scale(8) },
              ]}
              onPress={handleDelete}
            >
              <Trash2 color="white" size={scale(16)} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: scale(16),
    marginVertical: scale(8),
    borderRadius: scale(12),
    padding: scale(12),
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(2) },
    shadowOpacity: 0.1,
    shadowRadius: scale(3.84),
    elevation: 5,
  },
  previewWrapper: {
    position: 'relative',
    marginRight: scale(12),
  },
  previewContainer: {
    width: scale(80),
    height: scale(60),
    borderRadius: scale(8),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  playButton: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(16),
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonsOverlay: {
    position: 'absolute',
    top: scale(4),
    right: scale(4),
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: scale(16),
    padding: scale(2),
    alignItems: 'center',
  },
  actionButton: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(16),
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  infoRow: {
    marginBottom: scale(4),
  },
  videoName: {
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
  metadataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metadataInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metadata: {
    fontSize: moderateScale(12),
    marginRight: scale(8),
    opacity: 0.7,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});

export default VideoCard;
