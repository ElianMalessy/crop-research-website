import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import styles from '../../../styles/Home.module.css';
import { useState, Fragment, useEffect, useContext } from 'react';
import ChangeMapView from './ChangeMapView';
import KenyaMapData from '../Json/Kenya_1.json';
import EnhancedKenyaMapData from '../Json/Kenya_2.json';
import NigeriaMapData from '../Json/NGA1.json';
import EnhancedNigeriaMapData from '../Json/NGA2.json';
import { CountryContext } from '../../pages';

export default function Map({ enhance }) {
  const [locations, setLocations] = useState([]);
  const [coordinates, setCoordinates] = useState([8.10027290601264, 9.59981617681184]);
  const [bounds, setBounds] = useState([[2.67581510543829, 4.27263784408598], [14.6557188034058, 13.8920097351076]]);
  const country = useContext(CountryContext);
  useEffect(
    () => {
      const LeafIcon = L.Icon.extend({
        options: {}
      });
      const blueIcon = new LeafIcon({
          iconUrl: 'https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|abcdef&chf=a,s,ee00FFFF',
          iconSize: [20, 35],
          iconAnchor: [10, 35]
        }),
        redIcon = new LeafIcon({
          iconUrl: 'https://i.stack.imgur.com/ffAqZ.png',
          iconSize: [20, 35],
          iconAnchor: [10, 35]
        });
      if (!country) return;
      switch (country[0]) {
        case 'N':
          setCoordinates([9.0765, 7.3986]);
          setLocations([[8.7, 7.6, redIcon, 'not collected'], [10, 8.5, blueIcon, 'collected at ' + new Date()]]);
          setBounds([[2.67581510543829, 4.27263784408598], [14.6557188034058, 13.8920097351076]]);
          break;
        case 'E':
          setCoordinates([8.9806, 38.7578]);
          setLocations([
            [10.5, 39.2, blueIcon, 'collected at ' + new Date()],
            [10, 37.9, blueIcon, 'collected at ' + new Date()]
          ]);
          setBounds([[3.41243791580195, 33.0021171569826], [14.8304491043093, 47.9582290649417]]);

          break;
        case 'K':
          setCoordinates([-1.2921, 36.8219]);
          setLocations([[-1.67, 35.9, blueIcon, 'collected at ' + new Date()], [-2.5, 37.2, redIcon, 'not collected']]);
          setBounds([[-4.66606140136707, 33.913948059082], [5.05815601348894, 41.9262161254886]]);
          break;
        default:
          break;
      }
    },
    [country]
  );

  function onEachRegion(country, layer) {
    const props = country.properties;

    layer.bindPopup(
      `<dl> <span style="font-weight: 600">${props.NAME_2
        ? props.NAME_2
        : props.NAME_1}</span> <dd>crops (1000 ha) </dd> <dd> maize: ${props.maize} </dd>  <dd>cowpea: ${props.cowpea}</dd> <dd> cassava: ${props.cassava}</dd> </dl>`
    );
  }
  const GJSON = ({ data }) => {
    return <GeoJSON onEachFeature={onEachRegion} data={data} />;
  };
  return (
    <MapContainer className={styles.homeMap} center={coordinates} zoom={5} bounds={bounds}>
      <Fragment>
        <TileLayer
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          attribution='&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors'
        />
        {locations &&
          locations.map((location, index) => {
            return (
              <Marker key={index} position={[location[0], location[1]]} icon={location[2]}>
                <Popup>{location[3]}</Popup>
              </Marker>
            );
          })}
        {country === 'Nigeria' && !enhance && <GJSON data={NigeriaMapData.features} />}
        {country === 'Nigeria' && enhance && <GJSON data={EnhancedNigeriaMapData.features} />}
        {country === 'Kenya' && !enhance && <GJSON data={KenyaMapData.features} />}
        {country === 'Kenya' && enhance && <GJSON data={EnhancedKenyaMapData.features} />}

        <ChangeMapView bounds={bounds} country={country} />
      </Fragment>
    </MapContainer>
  );
}
