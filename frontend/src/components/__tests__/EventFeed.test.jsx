import { render, screen } from '@testing-library/react';

import EventFeed from '../../components/EventFeed.jsx';
import { useLiveStore } from '../../store/useLiveStore.js';

describe('EventFeed', () => {
  it('prepends entries', () => {
    useLiveStore.setState({
      logs: [
        { id: 2, message: 'Second', timestamp: new Date().toISOString() },
        { id: 1, message: 'First', timestamp: new Date().toISOString() },
      ],
    });

    render(<EventFeed />);
    const text = screen.getByText(/Second/);
    expect(text).toBeInTheDocument();
  });
});
