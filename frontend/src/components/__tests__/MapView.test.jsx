import { render, screen } from '@testing-library/react';

import MapView from '../../components/MapView.jsx';
import { useLiveStore } from '../../store/useLiveStore.js';

describe('MapView', () => {
  it('renders driver and incident markers from store', () => {
    useLiveStore.setState({
      drivers: [
        { id: '1', code: 'D-101', status: 'enroute', location: { lat: 0, lng: 0 }, speedKph: 40 },
      ],
      incidents: [
        { id: 'a', type: 'accident', location: { lat: 0, lng: 0 }, severity: 3, ttlSec: 300 },
      ],
      zones: [{ label: 'Zone A' }],
    });

    render(<MapView />);

    expect(screen.getByTestId('map-drivers')).toHaveTextContent('D-101');
    expect(screen.getByTestId('map-incidents')).toHaveTextContent('accident');
    expect(screen.getByTestId('map-zones')).toHaveTextContent('Zone A');
  });
});
