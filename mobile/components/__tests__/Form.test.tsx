import React from 'react';
import {
  act,
  render,
  fireEvent,
  waitFor,
} from '@testing-library/react-native';
import LotteryForm from '../Form';
import { useNewLottery } from '../../hooks/useNewLottery';

jest.mock('../../hooks/useNewLottery');

const mockedUseNewLottery = jest.mocked(useNewLottery);

const flushFormikValidation = async () => {
  await act(async () => {
    await Promise.resolve();
  });
};

describe('LotteryForm', () => {
  beforeEach(() => {
    mockedUseNewLottery.mockReturnValue({
      data: undefined,
      loading: false,
      error: undefined,
      createNewLottery: jest.fn().mockResolvedValue(undefined),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the form title and submit button', async () => {
    const { getByText } = render(
      <LotteryForm onSubmit={jest.fn()} onNavigateBack={jest.fn()} />,
    );

    await flushFormikValidation();

    expect(getByText('Add new lottery')).toBeTruthy();
    expect(getByText('ADD')).toBeTruthy();
  });

  it('updates both input values when the user types', async () => {
    const { getAllByLabelText } = render(
      <LotteryForm onSubmit={jest.fn()} onNavigateBack={jest.fn()} />,
    );

    const [nameInput, prizeInput] = getAllByLabelText('Text input field');

    fireEvent.changeText(nameInput, 'Mega Millions');
    fireEvent.changeText(prizeInput, '$100');
    await flushFormikValidation();

    await waitFor(() => {
      expect(nameInput.props.value).toBe('Mega Millions');
      expect(prizeInput.props.value).toBe('$100');
    });
  });

  it('shows a loader while submission is in progress', async () => {
    mockedUseNewLottery.mockReturnValue({
      data: undefined,
      loading: true,
      error: undefined,
      createNewLottery: jest.fn(),
    });

    const { queryByText, UNSAFE_getByType } = render(
      <LotteryForm onSubmit={jest.fn()} onNavigateBack={jest.fn()} />,
    );

    await flushFormikValidation();

    expect(queryByText('ADD')).toBeNull();
  });

  it('shows an error message when the hook returns an error', async () => {
    mockedUseNewLottery.mockReturnValue({
      data: undefined,
      loading: false,
      error: 'Request failed',
      createNewLottery: jest.fn(),
    });

    const { getByText } = render(
      <LotteryForm onSubmit={jest.fn()} onNavigateBack={jest.fn()} />,
    );

    await flushFormikValidation();

    expect(getByText('error')).toBeTruthy();
  });
});
