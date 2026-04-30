import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import FAB from '../Fab';

describe('FAB', () => {
  it('should render the FAB component', () => {
    const onPressMock = jest.fn();
    const { getByTestId } = render(<FAB onPress={onPressMock} />);
    const fab = getByTestId('fab');
    expect(fab).toBeTruthy();
  });

  it('should call onPress when FAB is pressed', () => {
    const onPressMock = jest.fn();
    const { getByTestId } = render(<FAB onPress={onPressMock} />);
    const fab = getByTestId('fab');

    fireEvent.press(fab);
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });
});
