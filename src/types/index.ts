import { VideoFile } from 'react-native-vision-camera';

export interface LocalVideo extends VideoFile {}

export interface RemoteVideo {
  name: string;
  publicUrl: string;
  metadata?: {
    size?: number;
    [key: string]: any;
  };
}

export type Video = LocalVideo | RemoteVideo;

export interface VideoCardProps {
  video: Video;
  isRemote?: boolean;
  onPlay: (video: Video) => void;
  onDelete: (video: Video) => void;
  onUpload?: (video: LocalVideo) => void;
  showUploadButton?: boolean;
}

export type UploadProgressCallback = (progress: number) => void;

export interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface RootStackParamList {
  MainTabs: undefined;
  Camera: undefined;
  VideoPlayBack: {
    video: Video;
  };
}
