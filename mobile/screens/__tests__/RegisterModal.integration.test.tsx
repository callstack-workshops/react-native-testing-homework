import React from 'react';
import {
  render,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

const HomeStub = () => <Text>Home Screen</Text>;

const renderRegisterFlow = () =>
  render(
    <NavigationContainer
      initialState={{
        index: 1,
        routes: [
          { name: 'Home' },
          {
            name: 'Register',
            params: { selectedLotteries: ['lottery-1', 'lottery-2'] },
          },
        ],
      }}
    >
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeStub} />
        <Stack.Screen name="Register" component={RegisterModal} />
      </Stack.Navigator>
    </NavigationContainer>,
  );

describe('RegisterModal integration', () => {
  beforeEach(() => {
    mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify(['existing']));
    mockedAsyncStorage.setItem.mockResolvedValue();
    globalThis.fetch = jest.fn().mockImplementation((url: string) => {
      if (url.includes('/register')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({}),
        });
      }

      return Promise.reject(new Error(`Unexpected fetch: ${url}`));
    }) as jest.Mock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('submits the registration and persists the selected lotteries', async () => {
    const { getByLabelText, getByRole, getByText } = renderRegisterFlow();

    await flushFormikValidation();

    fireEvent.changeText(getByLabelText('Text input field'), 'Alice');

    await flushFormikValidation();

    fireEvent.press(getByRole('button'));

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledTimes(2);
    });

    expect(globalThis.fetch).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining('/register'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ name: 'Alice', lotteryId: 'lottery-1' }),
      }),
    );

    expect(globalThis.fetch).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining('/register'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ name: 'Alice', lotteryId: 'lottery-2' }),
      }),
    );

    await waitFor(() => {
      expect(mockedAsyncStorage.setItem).toHaveBeenCalledWith(
        '@selectedLotteries',
        JSON.stringify(['existing', 'lottery-1', 'lottery-2']),
      );
      expect(getByText('Home Screen')).toBeTruthy();
    });
  });
});
