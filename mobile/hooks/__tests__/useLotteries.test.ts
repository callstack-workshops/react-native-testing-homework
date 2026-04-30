import { renderHook, act, waitFor } from '@testing-library/react-native';
import useLotteries from '../useLotteries';
import * as LotteryService from '../../services/lottery';
import { Lottery } from '../../types';

jest.mock('../../services/lottery');

const mockedLotteryService = jest.mocked(LotteryService);

const LOTTERY_1 = {
  id: 'lottery-1',
  name: 'Mega Millions',
  prize: '$100',
  type: 'simple',
  status: 'running',
} as Lottery;

const LOTTERY_2 = {
  id: 'lottery-2',
  name: 'Daily Draw',
  prize: '$25',
  type: 'simple',
  status: 'finished',
} as Lottery;

describe('useLotteries', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fetches lotteries on mount', async () => {
    const lotteries = [LOTTERY_1];

    mockedLotteryService.getLottieries.mockResolvedValue(lotteries);

    const { result } = renderHook(() => useLotteries());

    await waitFor(() => {
      expect(result.current.data).toEqual(lotteries);
    });

    expect(mockedLotteryService.getLottieries).toHaveBeenCalledTimes(1);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeUndefined();
  });

  it('stores an error when fetching lotteries fails', async () => {
    mockedLotteryService.getLottieries.mockRejectedValue(
      new Error('Network down'),
    );

    const { result } = renderHook(() => useLotteries());

    await waitFor(() => {
      expect(result.current.error).toBe('Network down');
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toEqual([]);
  });

  it('allows refetching lotteries manually', async () => {
    mockedLotteryService.getLottieries
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([LOTTERY_2]);

    const { result } = renderHook(() => useLotteries());

    await waitFor(() => {
      expect(mockedLotteryService.getLottieries).toHaveBeenCalledTimes(1);
    });

    await act(async () => {
      await result.current.fetchLotteries();
    });

    expect(mockedLotteryService.getLottieries).toHaveBeenCalledTimes(2);
    expect(result.current.data).toEqual([LOTTERY_2]);
  });
});
