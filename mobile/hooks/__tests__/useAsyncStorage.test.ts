import { renderHook, act, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useAsyncStorage from '../useAsyncStorage';

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
  },
}));

const mockedAsyncStorage = jest.mocked(AsyncStorage);

describe('useAsyncStorage', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('loads stored lotteries on mount', async () => {
    mockedAsyncStorage.getItem.mockResolvedValue(
      JSON.stringify(['lottery-1', 'lottery-2']),
    );

    const { result } = renderHook(() => useAsyncStorage());

    await waitFor(() => {
      expect(result.current.storedData).toEqual(['lottery-1', 'lottery-2']);
    });

    expect(mockedAsyncStorage.getItem).toHaveBeenCalledWith(
      '@selectedLotteries',
    );
  });

  it('appends new ids to existing stored lotteries', async () => {
    mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify(['existing']));
    mockedAsyncStorage.setItem.mockResolvedValue();

    const { result } = renderHook(() => useAsyncStorage());

    await act(async () => {
      await result.current.storeData(['lottery-1', 'lottery-2']);
    });

    expect(mockedAsyncStorage.setItem).toHaveBeenCalledWith(
      '@selectedLotteries',
      JSON.stringify(['existing', 'lottery-1', 'lottery-2']),
    );
  });

  it('reads stored data when getStoredData is called manually', async () => {
    mockedAsyncStorage.getItem
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(JSON.stringify(['manual']));

    const { result } = renderHook(() => useAsyncStorage());

    await act(async () => {
      await result.current.getStoredData();
    });

    await waitFor(() => {
      expect(result.current.storedData).toEqual(['manual']);
    });
  });
});
