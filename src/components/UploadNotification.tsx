import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { scale, moderateScale } from 'react-native-size-matters';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { Circle } from 'react-native-progress';
import { CheckCircle, X } from 'lucide-react-native';

export type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

export interface UploadNotificationProps {
  visible: boolean;
  status: UploadStatus;
  progress: number;
  colors: {
    primary: string;
    text: string;
    card: string;
    notification: string;
  };
}

const UploadNotification: React.FC<UploadNotificationProps> = ({
  visible,
  status,
  progress,
  colors,
}) => {
  // Animated values for the upload notification
  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);

  // Show/hide notification based on visibility
  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0);
      opacity.value = withTiming(1, { duration: 300 });
    } else {
      translateY.value = withSpring(-100);
      opacity.value = withTiming(0, { duration: 300 });
    }
  }, [visible, translateY, opacity]);

  // Animated style for slide and fade effects
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  // Get content based on upload status
  const getStatusContent = () => {
    switch (status) {
      case 'uploading':
        return {
          icon: (
            <Circle
              size={scale(50)}
              progress={progress / 100}
              color={colors.primary}
              borderWidth={3}
              strokeCap="round"
              showsText={true}
              textStyle={{
                fontSize: moderateScale(10),
                color: colors.text,
                fontWeight: 'bold',
              }}
            />
          ),
          title: 'Uploading Video...',
          subtitle: undefined,
          showProgress: false,
        };
      case 'success':
        return {
          icon: <CheckCircle color={colors.primary} size={scale(24)} />,
          title: 'Upload Complete!',
          subtitle: undefined,
          showProgress: false,
        };
      case 'error':
        return {
          icon: <X color={colors.notification} size={scale(24)} />,
          title: 'Upload Failed, Video already exists',
          subtitle: undefined,
          showProgress: false,
        };
      default:
        return {
          icon: null,
          title: '',
          subtitle: undefined,
          showProgress: false,
        };
    }
  };

  const statusContent = getStatusContent();

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={[styles.content, { backgroundColor: colors.card }]}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>{statusContent.icon}</View>
          <View style={styles.textContainer}>
            <Text style={[styles.title, { color: colors.text }]}>
              {statusContent.title}
            </Text>
            {statusContent.subtitle && (
              <Text style={[styles.subtitle, { color: colors.text }]}>
                {statusContent.subtitle}
              </Text>
            )}
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    padding: scale(16),
    alignItems: 'center',
  },
  content: {
    borderRadius: scale(12),
    padding: scale(16),
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(2) },
    shadowOpacity: 0.25,
    shadowRadius: scale(4),
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(8),
  },
  iconContainer: {
    width: scale(60),
    height: scale(60),
    borderRadius: scale(30),
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(12),
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    marginBottom: scale(4),
  },
  subtitle: {
    fontSize: moderateScale(12),
  },
});

export default UploadNotification;
