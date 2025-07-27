import * as RNFS from '@dr.pogodin/react-native-fs';
import { LocalVideo } from '../types';

const CACHE_DIR = RNFS.CachesDirectoryPath;

// Load videos from local cache directory
export const loadLocalVideos = async (): Promise<LocalVideo[]> => {
  try {
    const files: RNFS.ReadDirResItemT[] = await RNFS.readDir(CACHE_DIR);
    const videos = files
      .filter(
        (f: RNFS.ReadDirResItemT) =>
          f.isFile() &&
          f.name &&
          (f.name.endsWith('.mp4') || f.name.endsWith('.mov')),
      )
      .map((f: RNFS.ReadDirResItemT) => ({
        path: f.path,
        duration: f.ctime?.getTime() ?? 0,
        width: f.size ?? 0,
        height: f.size ?? 0,
      }))
      .sort((a: LocalVideo, b: LocalVideo) => b.path.localeCompare(a.path));

    return videos;
  } catch (error) {
    console.error('Error loading local videos:', error);
    return [];
  }
};

// Delete video file from local storage
export const deleteLocalVideo = async (path: string): Promise<void> => {
  try {
    await RNFS.unlink(path);
  } catch (error) {
    console.error('Error deleting local video:', error);
    throw new Error('Failed to delete local video');
  }
};

// Get video file size in MB
export const getVideoFileSize = async (
  path: string,
): Promise<string | null> => {
  try {
    const stats = await RNFS.stat(path);
    const sizeInMB = (stats.size / (1024 * 1024)).toFixed(1);
    return `${sizeInMB} MB`;
  } catch (error) {
    console.error('Error getting video file size:', error);
    return null;
  }
};

// Format video duration to MM:SS format
export const formatVideoDuration = (duration: number): string | null => {
  if (!duration) return null;

  const minutes = Math.floor(duration / 60000);
  const seconds = Math.floor((duration % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};
