import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useThemeContext } from '../context/ThemeContext';
import MainTabsNavigator from './MainTabsNavigator';
import CameraScreen from '../screens/CameraScreen';
import VideoPlayerScreen from '../screens/VideoPlayerScreen';
import { RootStackParamList } from './types';
import { MyDarkTheme, MyLightTheme } from '../utils/theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const { theme } = useThemeContext();

  return (
    <NavigationContainer theme={theme === 'dark' ? MyDarkTheme : MyLightTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="MainTabs"
          component={MainTabsNavigator}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name="Camera" component={CameraScreen} />
        <Stack.Screen
          name="VideoPlayBack"
          component={VideoPlayerScreen}
          options={{
            headerTitle: 'Video Player',
            headerShown: true,
            presentation: 'modal',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
