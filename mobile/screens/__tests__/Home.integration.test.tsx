import React from 'react';
import {
  render,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Home from '../Home';
import AddLottery from '../AddLottery';
import RegisterModal from '../RegisterModal';
import { RootStackParamList } from '../../types';

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
  },
}));

const mockedAsyncStorage = jest.mocked(AsyncStorage);

const Stack = createNativeStackNavigator<RootStackParamList>();

const flushFormikValidation = async () => {
  await act(async () => {
    await Promise.resolve();
  });
};

const lotteriesResponse = [
  {
    id: 'lottery-1',
    name: 'Mega Millions',
    prize: '$100',
    type: 'simple',
    status: 'running',
  },
];

const renderHomeFlow = () =>
  render(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="AddLottery" component={AddLottery} />
        <Stack.Screen name="Register" component={RegisterModal} />
      </Stack.Navigator>
    </NavigationContainer>,
  );

describe('Home screen integration', () => {
  beforeEach(() => {
    mockedAsyncStorage.getItem.mockResolvedValue(null);
    mockedAsyncStorage.setItem.mockResolvedValue();
    globalThis.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => lotteriesResponse,
    }) as jest.Mock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('navigates to the add lottery screen from the FAB', async () => {
    const { getByTestId, getByText } = renderHomeFlow();

    await waitFor(() => {
      expect(getByText('Mega Millions')).toBeTruthy();
    });

    fireEvent.press(getByTestId('fab'));

    await flushFormikValidation();

    expect(getByText('Add new lottery')).toBeTruthy();
  });

  it('navigates to the register modal after selecting a lottery', async () => {
    const { getByText, getByPlaceholderText } = renderHomeFlow();

    await waitFor(() => {
      expect(getByText('Mega Millions')).toBeTruthy();
    });

    fireEvent.press(getByText('Mega Millions'));
    fireEvent.press(getByText('Register'));

    await waitFor(() => {
      expect(getByText('Register to lotteries')).toBeTruthy();
      expect(getByPlaceholderText('Enter your name')).toBeTruthy();
    });
  });
});
