import { supabase, roleService } from '../utils/config';
import axios from 'axios';
import * as RNFS from '@dr.pogodin/react-native-fs';
import { Buffer } from 'buffer';
import { RemoteVideo } from '../types';

// Load videos from remote Supabase storage
export const loadRemoteVideos = async (): Promise<RemoteVideo[]> => {
  try {
    const { data, error } = await supabase.storage.from('videos').list();

    if (error) {
      console.error('Error fetching videos:', error);
      return [];
    }
    const videoList = (data || [])
      .filter(file => file.name.endsWith('.mp4') || file.name.endsWith('.mov'))
      .map(file => ({
        name: file.name,
        publicUrl:
          supabase.storage.from('videos').getPublicUrl(file.name).data
            .publicUrl || '',
        metadata: file.metadata,
      }));

    return videoList;
  } catch (error) {
    console.error('Error fetching videos:', error);
    return [];
  }
};

// Upload video to remote Supabase storage
export const uploadVideo = async (
  localPath: string,
  filename: string,
  onProgress?: (pct: number) => void,
): Promise<string> => {
  const bucket = 'videos';
  const projectId = 'icmmdaacjaowtklhlokt';
  const url = `https://${projectId}.supabase.co/storage/v1/object/${bucket}/${filename}`;
  const headers: Record<string, string> = {
    'Content-Type': 'video/mp4',
    Authorization: `Bearer ${roleService}`,
  };

  try {
    //read the file as base64
    const fileData = await RNFS.readFile(localPath, 'base64');
    const fileBuffer = Buffer.from(fileData, 'base64');

    await axios.post(url, fileBuffer, {
      headers,
      onUploadProgress: progressEvent => {
        if (progressEvent.total && onProgress) {
          const percentage = Math.min(
            (progressEvent.loaded / progressEvent.total) * 100,
            100,
          );
          console.log('percent:', percentage);
          onProgress(percentage);
        }
      },
    });

    const publicUrl = `https://${projectId}.supabase.co/storage/v1/object/public/${bucket}/${filename}`;
    return publicUrl;
  } catch (error: any) {
    console.log('Upload failed:', JSON.stringify(error, null, 2));
    throw new Error(`Upload failed: ${error?.message || 'Unknown error'}`);
  }
};

// Delete video from remote Supabase storage
export const deleteRemoteVideo = async (
  fileName: string,
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase.storage.from('videos').remove([fileName]);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'An error occurred while deleting the video',
    };
  }
};
