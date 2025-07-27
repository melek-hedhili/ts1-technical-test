# React Native Video App

A React Native application for recording, managing, and uploading videos with local and remote storage capabilities. Features a custom Supabase upload implementation with real-time progress tracking.

## 📱 Features

- **Video Recording**: Capture videos with front/back camera switching
- **Local Video Management**: View, play, and delete local videos
- **Remote Video Management**: View, play, and delete videos from Supabase storage
- **Custom Upload Progress**: Real-time upload progress (bypasses Supabase SDK limitations)
- **Video Player**: Full-featured player with controls and progress tracking

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
- **Android SDK**: API 33 (Android 13)
- **Android NDK**: 25.1.8937393
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

**Key Benefits:**

- Real-time progress tracking
- Better error handling
- Direct HTTP upload bypassing SDK limitations

## 📱 Screens

- **CameraScreen**: Video recording with camera controls
- **LocalVideosScreen**: Manage local videos with upload option
- **RemoteVideosScreen**: View and manage cloud videos
- **VideoPlayerScreen**: Play videos with upload/delete controls

## 🔐 Configuration

**Note**: Keys are exposed for demo purposes. In production, use environment variables.

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

## 🧪 Testing

```bash
npm test
```

## 📝 Key Implementation Notes

- **Custom Upload**: Bypassed Supabase SDK for progress tracking
- **File Processing**: Local files converted to buffer for upload
- **Progress UI**: Real-time progress display with animations
- **Android Only**: Optimized for Android platform

---

**Demo Project**: This is a technical test implementation with exposed keys for demonstration purposes.
