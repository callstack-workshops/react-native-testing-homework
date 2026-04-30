import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import LotteryList from '../LotteryList';
import { Lottery } from '../../types';

const lotteries: Lottery[] = [
  {
    id: 'lottery-1',
    name: 'Mega Millions',
    prize: '$100',
    type: 'cash',
    status: 'running',
  },
  {
    id: 'lottery-2',
    name: 'Daily Draw',
    prize: '$25',
    type: 'cash',
    status: 'finished',
  },
];

describe('LotteryList', () => {
  it('renders the list header and lotteries', () => {
    const { getByText } = render(
      <LotteryList
        lotteries={lotteries}
        loading={false}
        onPress={jest.fn()}
        selectedLotteries={[]}
        registeredLotteries={[]}
      />,
    );

    expect(getByText('Lotteries')).toBeTruthy();
    expect(getByText('Mega Millions')).toBeTruthy();
    expect(getByText('Daily Draw')).toBeTruthy();
  });

  it('filters lotteries when the search value changes', () => {
    const { getByLabelText, getByText, queryByText } = render(
      <LotteryList
        lotteries={lotteries}
        loading={false}
        onPress={jest.fn()}
        selectedLotteries={[]}
        registeredLotteries={[]}
      />,
    );

    fireEvent.changeText(getByLabelText('Text input field'), 'Mega');

    expect(getByText('Mega Millions')).toBeTruthy();
    expect(queryByText('Daily Draw')).toBeNull();
  });

  it('shows a no-results message when filtering hides every lottery', () => {
    const { getByLabelText, getByText } = render(
      <LotteryList
        lotteries={lotteries}
        loading={false}
        onPress={jest.fn()}
        selectedLotteries={[]}
        registeredLotteries={[]}
      />,
    );

    fireEvent.changeText(getByLabelText('Text input field'), 'missing');

    expect(getByText(' No search results for `missing`')).toBeTruthy();
  });

  it('calls onPress for active lotteries', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <LotteryList
        lotteries={lotteries}
        loading={false}
        onPress={onPress}
        selectedLotteries={[]}
        registeredLotteries={[]}
      />,
    );

    fireEvent.press(getByText('Mega Millions'));

    expect(onPress).toHaveBeenCalledWith('lottery-1');
  });

  it('does not call onPress for finished lotteries', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <LotteryList
        lotteries={lotteries}
        loading={false}
        onPress={onPress}
        selectedLotteries={[]}
        registeredLotteries={[]}
      />,
    );

    fireEvent.press(getByText('Daily Draw'));

    expect(onPress).not.toHaveBeenCalled();
  });

  it('shows the empty state when there are no lotteries and loading is false', () => {
    const { getByText } = render(
      <LotteryList
        lotteries={[]}
        loading={false}
        onPress={jest.fn()}
        selectedLotteries={[]}
        registeredLotteries={[]}
      />,
    );

    expect(getByText('There are no lotteries currently')).toBeTruthy();
  });
});
