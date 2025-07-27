import { useRef, useState } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { scale } from 'react-native-size-matters';
import { Camera, useCameraDevice, VideoFile } from 'react-native-vision-camera';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import {
  SwitchCamera,
  Circle,
  Square,
  X,
  ArrowLeft,
} from 'lucide-react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'Camera'>;

const CameraScreen: React.FC<Props> = ({ navigation }) => {
  const cameraRef = useRef<Camera>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [cameraPosition, setCameraPosition] = useState<'back' | 'front'>(
    'back',
  );
  const device = useCameraDevice(cameraPosition);

  // Start video recording
  const startRecording = async () => {
    setIsRecording(true);
    cameraRef?.current?.startRecording({
      onRecordingFinished: onFinishRecording,
      onRecordingError: error => {
        if (error.code === 'capture/recording-canceled') {
          setIsRecording(false);
        }
      },
    });
  };

  // Switch between front and back camera
  const switchCamera = () => {
    setCameraPosition(pos => (pos === 'back' ? 'front' : 'back'));
  };

  // Stop video recording
  const stopRecording = async () => {
    setIsRecording(false);
    await cameraRef.current?.stopRecording();
  };

  // Cancel video recording
  const cancelRecording = async () => {
    await cameraRef.current?.cancelRecording();
  };

  // Handle recording completion
  const onFinishRecording = (video: VideoFile) => {
    console.log('video', video);
    setIsRecording(false);
    navigation.navigate('VideoPlayBack', { video });
  };
  return (
    <View style={styles.container}>
      <Camera
        isActive
        ref={cameraRef}
        video
        audio
        device={device!}
        style={styles.camera}
        videoStabilizationMode="off"
        videoHdr={false}
      />

      {/* Back Icon */}
      <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
        <ArrowLeft color="#FFF" size={scale(32)} />
      </Pressable>

      {/* Switch Camera Icon */}
      <Pressable style={styles.switchCamera} onPress={switchCamera}>
        <SwitchCamera color="#FFF" size={scale(32)} />
      </Pressable>

      {/* Record Icon */}
      <Pressable
        style={styles.recordButton}
        onPress={isRecording ? stopRecording : startRecording}
      >
        <View style={styles.recordButtonContent}>
          {isRecording ? (
            <>
              <Square color="#FFF" size={scale(64)} />
              <Pressable
                onPress={cancelRecording}
                style={{ marginLeft: scale(24) }}
              >
                <X color="#FFF" size={scale(48)} />
              </Pressable>
            </>
          ) : (
            <Circle color="#FFF" size={scale(64)} />
          )}
        </View>
      </Pressable>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    ...StyleSheet.absoluteFillObject,
  },
  backButton: {
    position: 'absolute',
    top: scale(10),
    left: scale(10),
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: scale(24),
    padding: scale(8),
  },
  switchCamera: {
    position: 'absolute',
    top: scale(10),
    right: scale(10),
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: scale(24),
    padding: scale(8),
  },
  recordButton: {
    position: 'absolute',
    bottom: scale(40),
    alignSelf: 'center',
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: scale(40),
    padding: scale(8),
  },
  stopRecording: {
    position: 'absolute',
    top: scale(10),
    left: scale(10),
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: scale(24),
    padding: scale(8),
  },
  recordButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CameraScreen;
