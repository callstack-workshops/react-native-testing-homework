import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useNewLottery } from '../useNewLottery';
import * as LotteryService from '../../services/lottery';
import { Lottery } from '../../types';

jest.mock('../../services/lottery');

const mockedLotteryService = jest.mocked(LotteryService);

const LOTTERY = {
  id: 'lottery-1',
  name: 'Mega Millions',
  prize: '$100',
  type: 'simple',
  status: 'running',
} as Lottery;

describe('useNewLottery', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('creates a lottery and stores the returned data', async () => {
    const createdLottery = LOTTERY;

    mockedLotteryService.createNewLottery.mockResolvedValue(createdLottery);

    const { result } = renderHook(() => useNewLottery());

    await act(async () => {
      await result.current.createNewLottery({
        name: 'Mega Millions',
        prize: '$100',
      });
    });

    expect(mockedLotteryService.createNewLottery).toHaveBeenCalledWith({
      name: 'Mega Millions',
      prize: '$100',
    });
    expect(result.current.data).toEqual(createdLottery);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeUndefined();
  });

  it('stores the error and rethrows when creation fails', async () => {
    const error = new Error('Request failed');

    mockedLotteryService.createNewLottery.mockRejectedValue(error);

    const { result } = renderHook(() => useNewLottery());

    let thrownError: Error | undefined;

    await act(async () => {
      try {
        await result.current.createNewLottery({
          name: 'Mega Millions',
          prize: '$100',
        });
      } catch (caughtError) {
        thrownError = caughtError as Error;
      }
    });

    expect(thrownError).toEqual(error);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe('Request failed');
    });
  });
});
