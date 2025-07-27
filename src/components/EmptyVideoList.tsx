import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { scale, moderateScale } from 'react-native-size-matters';
import { VideoOff } from 'lucide-react-native';
import { useTheme } from '@react-navigation/native';

interface EmptyVideoListProps {
  message: string;
}

const EmptyVideoList: React.FC<EmptyVideoListProps> = ({ message }) => {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <VideoOff
        color={colors.border}
        size={scale(48)}
        style={{ marginBottom: scale(12) }}
      />
      <Text style={[styles.text, { color: colors.text, opacity: 0.7 }]}>
        {message}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scale(48),
  },
  text: {
    fontSize: moderateScale(18),
    textAlign: 'center',
  },
});

export default EmptyVideoList;
