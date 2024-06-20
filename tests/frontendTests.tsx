import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MyComponent } from './MyComponent';

process.env.REACT_APP_API_BASE_URL = 'https://api.example.com';

describe('MyComponent Tests', () => {
  it('renders the component showing the expected heading text', async () => {
    render(<MyComponent />);
    expect(screen.getByRole('heading')).toHaveTextContent('Welcome');
  });

  it('updates the alert text upon button interaction', async () => {
    render(<MyComponent />);
    fireEvent.click(screen.getByText('Click Me'));
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Clicked!'));
  });

  it('performs data fetch and displays the result in an article element', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ data: 'Sample fetched data' }),
      }),
    ) as jest.Mock;

    render(<MyComponent />);
    await waitFor(() => expect(screen.getByRole('article')).toHaveTextContent('Sample fetched data'));
  });

  it('ensures component rendering is performed efficiently, within a performance budget', async () => {
    const startRenderTime = performance.now();
    render(<MyComponent />);
    const endRenderTime = performance.now();

    const renderTimeElapsed = endRenderTime - startRenderTime;
    expect(renderTimeElapsed).toBeLessThan(1000);
  });
});