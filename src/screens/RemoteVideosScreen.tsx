import React, { useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { scale } from 'react-native-size-matters';
import {
  useTheme,
  useNavigation,
  useFocusEffect,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import VideoCard from '../components/VideoCard';
import { loadRemoteVideos, deleteRemoteVideo } from '../services/remote-videos';
import EmptyVideoList from '../components/EmptyVideoList';
import { RemoteVideo } from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const RemoteVideosScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const [videos, setVideos] = useState<RemoteVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Load remote videos from server
  const loadVideos = async () => {
    setInitialLoading(true);
    try {
      const videoList = await loadRemoteVideos();
      console.log('videoList', videoList);
      setVideos(videoList);
    } catch (error) {
      console.error('Error loading videos:', error);
      setVideos([]);
    } finally {
      setInitialLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadVideos();
    }, []),
  );

  // Refresh remote video list
  const handleRefresh = async () => {
    setLoading(true);
    try {
      const videoList = await loadRemoteVideos();
      console.log('videoList', videoList);
      setVideos(videoList);
    } catch (error) {
      console.error('Error loading videos:', error);
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  // Delete remote video
  const handleDelete = async (video: RemoteVideo | any) => {
    try {
      const result = await deleteRemoteVideo(video.name);

      if (result.success) {
        setVideos(prevVideos => prevVideos.filter(v => v.name !== video.name));
      } else {
        Alert.alert(
          'Delete Failed',
          result.error || 'An error occurred while deleting the video',
        );
      }
    } catch (error) {
      Alert.alert(
        'Delete Failed',
        'An error occurred while deleting the video',
      );
    }
  };

  // Play remote video
  const handlePlay = (video: RemoteVideo | any) => {
    navigation.navigate('VideoPlayBack', {
      video: {
        path: video.publicUrl,
        duration: 0,
        width: 0,
        height: 0,
      },
    });
  };

  // Render video item for FlatList
  const renderVideoItem = ({ item }: { item: RemoteVideo }) => (
    <VideoCard
      video={item}
      isRemote={true}
      onPlay={handlePlay}
      onDelete={handleDelete}
      showUploadButton={false}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {initialLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={videos}
          renderItem={renderVideoItem}
          keyExtractor={item => item.name}
          style={{ width: '100%' }}
          contentContainerStyle={styles.listContent}
          refreshing={loading}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
          }
          ListEmptyComponent={
            <EmptyVideoList message="No remote videos found." />
          }
        />
      )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RemoteVideosScreen;
