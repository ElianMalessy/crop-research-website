import dynamic from 'next/dynamic';

const Map = dynamic(() => import('./Map'), {
  isLoading: <div style={{ width: '55rem' }} />,
  ssr: false
});

export default Map;
