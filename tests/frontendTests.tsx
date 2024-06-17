import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MyComponent } from './MyComponent';

process.env.REACT_APP_API_BASE_URL = 'https://api.example.com';

describe('MyComponent Tests', () => {
  it('renders correctly', async () => {
    render(<MyComponent />);
    expect(screen.getByRole('heading')).toHaveTextContent('Welcome');
  });

  it('updates content on button click', async () => {
    render(<MyComponent />);
    fireEvent.click(screen.getByText('Click Me'));
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Clicked!'));
  });

  it('fetches and displays data correctly', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ data: 'Sample fetched data' }),
      }),
    ) as jest.Mock;

    render(<MyComponent />);
    await waitFor(() => expect(screen.getByRole('article')).toHaveTextSample('Sample fetched data'));
  });

  it('renders heavy component efficiently', async () => {
    const startTime = performance.now();
    render(<MyComponent />);
    const endTime = performance.now();

    const renderTime = endTime - startTime;
    expect(renderTime).toBeLessThan(1000);
  });
});