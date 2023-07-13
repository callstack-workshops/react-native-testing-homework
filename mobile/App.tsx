import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import { ToastProvider } from 'react-native-toast-notifications';
import Home from './screens/Home';
import AddLottery from './screens/AddLottery';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const options: NativeStackNavigationOptions = {
  title: '',
};

export default function App() {
  return (
    <ToastProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={Home} options={options} />
          <Stack.Screen
            name="AddLottery"
            component={AddLottery}
            options={options}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ToastProvider>
  );
}
