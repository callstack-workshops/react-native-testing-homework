import { renderHook, act, waitFor } from '@testing-library/react-native';
import useLotteryRegister from '../useLotteryRegister';
import * as LotteryService from '../../services/lottery';
import useAsyncStorage from '../useAsyncStorage';

jest.mock('../../services/lottery');
jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
  },
}));
jest.mock('../useAsyncStorage');

const mockedLotteryService = jest.mocked(LotteryService);
const mockedUseAsyncStorage = jest.mocked(useAsyncStorage);

describe('useLotteryRegister', () => {
  const storeData = jest.fn();

  beforeEach(() => {
    mockedUseAsyncStorage.mockReturnValue({
      storedData: undefined,
      storeData,
      getStoredData: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('registers every selected lottery and persists the ids', async () => {
    mockedLotteryService.registerToLottery.mockResolvedValue(undefined);

    const { result } = renderHook(() => useLotteryRegister());

    await act(async () => {
      await result.current.registerToLotteries({
        name: 'Alice',
        lotteries: ['lottery-1', 'lottery-2'],
      });
    });

    expect(mockedLotteryService.registerToLottery).toHaveBeenCalledTimes(2);
    expect(mockedLotteryService.registerToLottery).toHaveBeenNthCalledWith(1, {
      name: 'Alice',
      lotteryId: 'lottery-1',
    });
    expect(mockedLotteryService.registerToLottery).toHaveBeenNthCalledWith(2, {
      name: 'Alice',
      lotteryId: 'lottery-2',
    });
    expect(storeData).toHaveBeenCalledWith(['lottery-1', 'lottery-2']);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeUndefined();
  });

  it('stores the error and rethrows when registration fails', async () => {
    mockedLotteryService.registerToLottery.mockRejectedValue(
      new Error('Registration failed'),
    );

    const { result } = renderHook(() => useLotteryRegister());

    let thrownError: Error | undefined;

    await act(async () => {
      try {
        await result.current.registerToLotteries({
          name: 'Alice',
          lotteries: ['lottery-1'],
        });
      } catch (caughtError) {
        thrownError = caughtError as Error;
      }
    });

    expect(thrownError?.message).toBe('Registration failed');

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe('Registration failed');
    });

    expect(storeData).not.toHaveBeenCalled();
  });
});
