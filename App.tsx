import { StyleSheet } from 'react-native';
import { ThemeProvider as ThemeContextProvider } from './src/context/ThemeContext';
import RootNavigator from './src/navigation/RootNavigator';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  return (
    <ThemeContextProvider>
      <GestureHandlerRootView style={styles.container}>
        <RootNavigator />
      </GestureHandlerRootView>
    </ThemeContextProvider>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
