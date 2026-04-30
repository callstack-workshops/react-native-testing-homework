import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Search from '../SearchInput';

describe('Search', () => {
  it('should render the Search component', () => {
    const { getByLabelText } = render(<Search value="" onSearch={() => {}} />);
    const input = getByLabelText('Text input field');
    expect(input).toBeTruthy();
  });

  it('should call onSearch with the entered value when text changes', () => {
    const onSearchMock = jest.fn();
    const { getByLabelText } = render(
      <Search value="" onSearch={onSearchMock} />,
    );
    const input = getByLabelText('Text input field');

    fireEvent.changeText(input, 'test value');
    expect(onSearchMock).toHaveBeenCalledWith('test value');
  });

  it('should display the provided value in the input field', () => {
    const { getByLabelText } = render(
      <Search value="sample text" onSearch={() => {}} />,
    );
    const input = getByLabelText('Text input field');
    expect(input.props.value).toBe('sample text');
  });

  it('matches the snapshot', () => {
    const { toJSON } = render(
      <Search value="sample text" onSearch={jest.fn()} />,
    );

    expect(toJSON()).toMatchSnapshot();
  });
});
