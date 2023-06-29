import React from 'react';
import Store from './src/store';
import Toast from 'react-native-toast-message';
import toastConfig from '@Config/toast';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import StackNavigator from '@Navigator/stack.navigator';
import 'react-native-gesture-handler';

const App = () => {
  return (
    <Provider store={Store}>
      <SafeAreaProvider>
        <StackNavigator/>
        <Toast position="bottom" config={toastConfig}/>
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;
