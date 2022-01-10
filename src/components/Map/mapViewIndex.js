import dynamic from 'next/dynamic';
const ChangeMapView = dynamic(() => import('./ChangeMapView'), {  
  ssr: false
});
export default ChangeMapView;