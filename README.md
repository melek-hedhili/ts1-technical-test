# 📱 Features

- **Video Recording**: Capture videos with front/back camera switching
- **Local Video Management**: View, play, and delete local videos
- **Remote Video Management**: View, play, and delete videos from Supabase storage
- **Custom Upload Progress**: Real-time upload progress (bypasses Supabase SDK limitations)
- **Video Player**: Full-featured player with controls and progress tracking

## ✅ Achieved Requirements

### Core Requirements ✅

- ✅ **Video Recording**: Implemented with react-native-vision-camera
- ✅ **Camera Switch**: Front/back camera switching functionality
- ✅ **Real-time Preview**: Live camera preview during recording
- ✅ **Video Playback**: Full video player with controls
- ✅ **Save/Delete Options**: Users can save or delete recorded videos
- ✅ **Home Page**: Main screen with "Record Video" button and video list
- ✅ **Camera Page**: Dedicated camera interface with all required features

### Bonus Features ✅

- ✅ **Supabase Upload**: Video upload to cloud storage (bonus requirement)
- ✅ **Upload Progress Bar**: Real-time progress tracking with custom implementation
- ✅ **Dark Mode Support**: Adaptive theming with React Navigation
- ✅ **Permission Management**: Comprehensive camera/microphone permission handling

### Technical Requirements ✅

- ✅ **React Native with TypeScript**: Full TypeScript implementation
- ✅ **react-native-vision-camera**: Used for camera functionality
- ✅ **react-navigation**: Navigation implementation with tabs and stack
- ✅ **Clean Code**: Well-structured, commented, and organized codebase

## 🏗️ Project Structure

```
src/
├── components/           # UI components
├── screens/            # Main screens
├── services/           # Business logic
├── types/              # TypeScript definitions
└── utils/              # Utilities and config
```

## 🔧 Technical Requirements

- **React Native**: 0.80.1
- **Android SDK**: API 35
- **Android NDK**: 27.1.12297006
- **Node.js**: >= 18
- **Platform**: Android only

## 🚀 Custom Supabase Upload

The app implements a custom upload solution because Supabase's default upload doesn't provide progress callbacks:

```typescript
export const uploadVideo = async (
  localPath: string,
  filename: string,
  onProgress?: (pct: number) => void,
): Promise<string> => {
  const url = `https://${projectId}.supabase.co/storage/v1/object/${bucket}/${filename}`;

  // Read file and convert to buffer
  const fileData = await RNFS.readFile(localPath, 'base64');
  const fileBuffer = Buffer.from(fileData, 'base64');

  // Use axios for progress tracking
  await axios.post(url, fileBuffer, {
    headers: {
      'Content-Type': 'video/mp4',
      Authorization: `Bearer ${roleService}`,
    },
    onUploadProgress: progressEvent => {
      if (progressEvent.total && onProgress) {
        const percentage = (progressEvent.loaded / progressEvent.total) * 100;
        onProgress(percentage);
      }
    },
  });

  return publicUrl;
};
```

### File Processing Process:

1. **Base64 Reading**: `RNFS.readFile(localPath, 'base64')` reads the video file from local storage and converts it to base64 string
2. **Buffer Conversion**: `Buffer.from(fileData, 'base64')` converts the base64 string back to a binary buffer that axios can upload
3. **Direct Upload**: The buffer is sent directly to Supabase's storage endpoint via HTTP POST
4. **Progress Tracking**: Axios `onUploadProgress` callback provides real-time upload progress

**Why Base64?** React Native file system reads files as base64 strings, but HTTP uploads need binary data. The conversion ensures compatibility while maintaining upload progress tracking.

## 📱 Screens

- **CameraScreen**: Video recording with camera controls
- **LocalVideosScreen**: Manage local videos with upload option
- **RemoteVideosScreen**: View and manage cloud videos
- **VideoPlayerScreen**: Play videos with upload/delete controls

## 🔐 Configuration

**Note**: Keys are exposed for demo purposes.

```typescript
// src/utils/config.ts
export const url = 'https://icmmdaacjaowtklhlokt.supabase.co';
export const roleService = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

## 🚀 Getting Started

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Start Metro**

   ```bash
   npm start
   ```

3. **Run on Android**
   ```bash
   npm run android
   ```
