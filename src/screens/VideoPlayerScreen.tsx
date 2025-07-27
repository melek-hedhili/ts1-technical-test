import { FC, useState, useRef } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { scale } from 'react-native-size-matters';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { runOnJS } from 'react-native-worklets';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import Video, {
  VideoRef,
  OnLoadData,
  OnProgressData,
} from 'react-native-video';
import { useTheme } from '@react-navigation/native';
import { uploadVideo } from '../services/remote-videos';
import { deleteLocalVideo } from '../services/local-videos';
import { deleteRemoteVideo } from '../services/remote-videos';
import UploadNotification, {
  UploadStatus,
} from '../components/UploadNotification';
import VideoControlsBar from '../components/VideoControlsBar';
import VideoProgressBar from '../components/VideoProgressBar';
import { v4 as uuidv4 } from 'uuid';

type Props = NativeStackScreenProps<RootStackParamList, 'VideoPlayBack'>;

// Define upload state interface
interface UploadState {
  uploading: boolean;
  progress: number;
  status: UploadStatus;
}

const VideoPlayBackScreen: FC<Props> = ({ route, navigation }) => {
  const { video } = route.params;
  const { colors } = useTheme();
  const videoRef = useRef<VideoRef>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const controlsOpacity = useSharedValue(1);
  const controlsTimeout = useRef<NodeJS.Timeout | null>(null);

  const [paused, setPaused] = useState(false);

  // Handle video load event
  const handleLoad = (meta: OnLoadData) => setDuration(meta.duration);

  // Handle video progress updates
  const handleProgress = (progress: OnProgressData) =>
    setCurrentTime(progress.currentTime);

  // Handle video end event
  const handleEnd = () => {
    setPaused(true);
    setCurrentTime(duration);
    controlsOpacity.value = withTiming(1, { duration: 200 });
    if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
  };

  // Toggle play/pause state
  const handlePlayPause = () => {
    setPaused(p => {
      const next = !p;
      if (!next) {
        showAndAutoHideControls();
        if (currentTime >= duration && duration > 0) {
          videoRef.current?.seek(0);
          setCurrentTime(0);
        }
      } else {
        controlsOpacity.value = withTiming(1, { duration: 200 });
        if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
      }
      return next;
    });
  };

  // Show controls and auto-hide after delay
  const showAndAutoHideControls = () => {
    if (controlsOpacity.value > 0.5) {
      controlsOpacity.value = withTiming(0, { duration: 200 });
      if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
      return;
    }

    controlsOpacity.value = withTiming(1, { duration: 200 });
    if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    controlsTimeout.current = setTimeout(() => {
      controlsOpacity.value = withTiming(0, { duration: 400 });
    }, 2500);
  };

  const animatedControlsStyle = useAnimatedStyle(() => ({
    opacity: controlsOpacity.value,
    backgroundColor: colors.background + 'cc',
    display: controlsOpacity.value > 0.01 ? 'flex' : 'none',
  }));

  const tapGesture = Gesture.Tap().onStart(() => {
    runOnJS(showAndAutoHideControls)();
  });

  // Consolidated upload state
  const [uploadState, setUploadState] = useState<UploadState>({
    uploading: false,
    progress: 0,
    status: 'idle',
  });

  // Add a function to determine if the video is local or remote
  const isLocalVideo = video.path && !video.path.startsWith('http');

  // Delete video from local or remote storage
  const handleDelete = async () => {
    if (isLocalVideo) {
      try {
        await deleteLocalVideo(video.path);
        Alert.alert('Deleted', 'Video deleted from device.');
        navigation.goBack();
      } catch (e) {
        Alert.alert('Delete Failed', 'Could not delete local video.');
      }
    } else {
      const filename = video.path.split('/').pop();
      if (!filename) return;
      const result = await deleteRemoteVideo(filename);
      if (result.success) {
        Alert.alert('Deleted', 'Video deleted from Supabase.');
        navigation.goBack();
      } else {
        Alert.alert(
          'Delete Failed',
          result.error || 'Could not delete remote video.',
        );
      }
    }
  };

  // Upload local video to remote storage
  const handleUpload = async () => {
    // Pause the video before starting upload
    setPaused(true);

    setUploadState({
      uploading: true,
      progress: 0,
      status: 'uploading',
    });

    try {
      const filename = video.path.split('/').pop() || `video_${uuidv4()}.mp4`;
      const url = await uploadVideo(video.path, filename, progress => {
        setUploadState(prev => ({ ...prev, progress }));
      });

      setUploadState(prev => ({ ...prev, status: 'success' }));
      console.log('Upload successful:', url);

      setTimeout(() => {
        setUploadState({
          uploading: false,
          progress: 0,
          status: 'idle',
        });
      }, 2000);
    } catch (e: any) {
      console.log(e);
      setUploadState(prev => ({ ...prev, status: 'error' }));

      setTimeout(() => {
        setUploadState({
          uploading: false,
          progress: 0,
          status: 'idle',
        });
      }, 3000);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <GestureDetector gesture={tapGesture}>
        <Animated.View style={styles.touchable}>
          <Video
            ref={videoRef}
            source={{ uri: video.path }}
            style={styles.video}
            resizeMode="contain"
            paused={paused}
            onLoad={handleLoad}
            onProgress={handleProgress}
            onEnd={handleEnd}
          />

          <VideoProgressBar
            currentTime={currentTime}
            duration={duration}
            colors={{
              primary: colors.primary,
              text: colors.text,
              border: colors.border,
            }}
          />

          <Animated.View style={[styles.controlsBar, animatedControlsStyle]}>
            <VideoControlsBar
              paused={paused}
              onPlayPause={handlePlayPause}
              onDelete={handleDelete}
              onUpload={isLocalVideo ? handleUpload : undefined}
              isLocalVideo={!!isLocalVideo}
              uploading={uploadState.uploading}
              colors={{
                primary: colors.primary,
                text: colors.text,
                notification: colors.notification,
              }}
            />
          </Animated.View>
        </Animated.View>
      </GestureDetector>

      <UploadNotification
        visible={uploadState.uploading}
        status={uploadState.status}
        progress={uploadState.progress}
        colors={colors}
      />
    </View>
  );
};

export default VideoPlayBackScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  touchable: {
    flex: 1,
  },
  video: {
    flex: 1,
  },
  progressBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlsBar: {
    position: 'absolute',
    bottom: scale(60),
    left: scale(20),
    right: scale(20),
  },
  controlsIconBtn: {
    borderRadius: scale(20),
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
});
