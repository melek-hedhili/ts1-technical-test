import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '@react-navigation/native';
import { scale } from 'react-native-size-matters';
import {
  Home as HomeIcon,
  Cloud as CloudIcon,
  Moon,
  Sun,
} from 'lucide-react-native';
import { Pressable } from 'react-native';
import { useThemeContext } from '../context/ThemeContext';
import LocalVideosScreen from '../screens/LocalVideosScreen';
import RemoteVideosScreen from '../screens/RemoteVideosScreen';
import { TabParamList } from './types';

const Tab = createBottomTabNavigator<TabParamList>();

const MainTabsNavigator: React.FC = () => {
  const { colors } = useTheme();
  const { theme, toggleTheme } = useThemeContext();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'LocalVideos') {
            return <HomeIcon color={color} size={scale(size)} />;
          } else if (route.name === 'RemoteVideos') {
            return <CloudIcon color={color} size={scale(size)} />;
          }
          return null;
        },
        headerShown: true,
        headerTitle:
          route.name === 'LocalVideos' ? 'Local Videos' : 'Remote Videos',
        headerRight: () => (
          <Pressable
            onPress={toggleTheme}
            style={{ marginRight: scale(16) }}
            hitSlop={scale(10)}
          >
            {theme === 'dark' ? (
              <Sun size={scale(24)} color="white" />
            ) : (
              <Moon size={scale(24)} color="black" />
            )}
          </Pressable>
        ),
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
      })}
    >
      <Tab.Screen
        name="LocalVideos"
        component={LocalVideosScreen}
        options={{ title: 'Local' }}
      />
      <Tab.Screen
        name="RemoteVideos"
        component={RemoteVideosScreen}
        options={{ title: 'Remote' }}
      />
    </Tab.Navigator>
  );
};

export default MainTabsNavigator;
