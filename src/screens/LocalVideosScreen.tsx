import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Pressable,
  Alert,
  Linking,
} from 'react-native';
import { scale } from 'react-native-size-matters';
import {
  useTheme,
  useNavigation,
  useFocusEffect,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  useCameraPermission,
  useMicrophonePermission,
} from 'react-native-vision-camera';
import { RootStackParamList } from '../navigation/types';
import VideoCard from '../components/VideoCard';
import { loadLocalVideos, deleteLocalVideo } from '../services/local-videos';
import { Camera } from 'lucide-react-native';
import EmptyVideoList from '../components/EmptyVideoList';
import { LocalVideo } from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const LocalVideosScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const [videos, setVideos] = useState<LocalVideo[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  //camera and microphone permissions
  const {
    hasPermission: hasCameraPermission,
    requestPermission: requestCameraPermission,
  } = useCameraPermission();
  const {
    hasPermission: hasMicrophonePermission,
    requestPermission: requestMicrophonePermission,
  } = useMicrophonePermission();

  const openSettings = async () => {
    try {
      await Linking.openSettings();
    } catch (error) {
      console.error('Error opening settings:', error);
    }
  };

  // Load local videos from device
  const loadVideos = async () => {
    try {
      const videoList = await loadLocalVideos();
      setVideos(videoList);
    } catch (error) {
      console.error('Error loading videos:', error);
      setVideos([]);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadVideos();
    }, []),
  );

  // Refresh video list
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const videoList = await loadLocalVideos();
      setVideos(videoList);
    } catch (error) {
      console.error('Error loading videos:', error);
      setVideos([]);
    } finally {
      setRefreshing(false);
    }
  };

  // Delete local video
  const handleDelete = async (video: LocalVideo | any) => {
    try {
      await deleteLocalVideo(video.path);

      setVideos(prevVideos => prevVideos.filter(v => v.path !== video.path));
    } catch (error) {
      console.error('Error deleting video:', error);
    }
  };

  // Play local video
  const handlePlay = (video: LocalVideo | any) => {
    navigation.navigate('VideoPlayBack', { video });
  };

  // Upload local video
  const handleUpload = (video: LocalVideo) => {
    navigation.navigate('VideoPlayBack', { video });
  };

  // Handle camera button press with permissions
  const handleCameraPress = async () => {
    if (hasCameraPermission && hasMicrophonePermission) {
      navigation.navigate('Camera');
      return;
    }

    //camera permission
    const cameraPermission = await requestCameraPermission();
    if (!cameraPermission) {
      Alert.alert(
        'Camera Permission Required',
        'Camera permission is required to record videos. Please enable it in Settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Settings', onPress: openSettings },
        ],
      );
      return;
    }

    //microphone permission
    const microphonePermission = await requestMicrophonePermission();
    if (!microphonePermission) {
      Alert.alert(
        'Microphone Permission Required',
        'Microphone permission is required to record videos with audio. Please enable it in Settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Settings', onPress: openSettings },
        ],
      );
      return;
    }

    navigation.navigate('Camera');
  };

  // Render video item for FlatList
  const renderVideoItem = ({ item }: { item: LocalVideo }) => (
    <VideoCard
      video={item}
      isRemote={false}
      onPlay={handlePlay}
      onDelete={handleDelete}
      onUpload={handleUpload}
      showUploadButton={true}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={videos}
        renderItem={renderVideoItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        keyExtractor={item => item.path}
        style={{ width: '100%' }}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<EmptyVideoList message="No local videos found." />}
      />
      <Pressable
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={handleCameraPress}
      >
        <Camera color="white" size={scale(32)} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  listContent: {
    paddingBottom: scale(20),
    flexGrow: 1,
  },
  fab: {
    position: 'absolute',
    bottom: scale(28),
    right: scale(28),
    width: scale(50),
    height: scale(50),
    borderRadius: scale(32),
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(2) },
    shadowOpacity: 0.2,
    shadowRadius: scale(4),
  },
});

export default LocalVideosScreen;
