import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<TabParamList>;
  Camera: undefined;
  VideoPlayBack: {
    video: any;
  };
};

export type TabParamList = {
  LocalVideos: undefined;
  RemoteVideos: undefined;
};
