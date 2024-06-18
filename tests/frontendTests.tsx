import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MyComponent } from './MyComponent';

process.env.REACT_APP_API_BASE_URL = 'https://api.example.com';

describe('MyComponent Tests', () => {
  it('should render the component with the expected heading', async () => {
    render(<MyComponent />);
    expect(screen.getByRole('heading')).toHaveTextContent('Welcome');
  });

  it('should update alert content when button is clicked', async () => {
    render(<MyComponent />);
    fireEvent.click(screen.getByText('Click Me'));
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Clicked!'));
  });

  it('should fetch data and display it within an article role', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ data: 'Sample fetched data' }),
      }),
    ) as jest.Mock;

    render(<MyComponent />);
    await waitFor(() => expect(screen.getByRole('article')).toHaveTextContent('Sample fetched data'));
  });

  it('should render the component efficiently under a second', async () => {
    const startTime = performance.now();
    render(<MyComponent />);
    const endTime = performance.now();

    const renderDuration = endTime - startTime;
    expect(renderDuration).toBeLessThan(1000);
  });
});