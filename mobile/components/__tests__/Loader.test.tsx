import React from 'react';
import { render } from '@testing-library/react-native';
import Loader from '../Loader';

describe('Loader', () => {
  it('should render the Loader component', () => {
    const { getByTestId } = render(<Loader />);
    const loader = getByTestId('loader');
    expect(loader).toBeTruthy();
  });
});
