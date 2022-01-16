import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import styles from '../../../styles/Home.module.css';
import { useState, Fragment, useEffect, useContext, useCallback } from 'react';
import ChangeMapView from './ChangeMapView';
import { CountryContext, DataContext } from '../../pages';
import cropData from './data';

export default function Map({ enhance, date, filter }) {
  const [locations, setLocations] = useState([]);
  const [bounds, setBounds] = useState([[2.67581510543829, 4.27263784408598], [14.6557188034058, 13.8920097351076]]);
  const country = useContext(CountryContext);
  const data = useContext(DataContext);

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
  const getCropsWithDate = useCallback(
    (cropData) => {
      const locations = [];
      cropData.forEach((dataPoint) => {
        if (!dataPoint[3]) locations.push(dataPoint);
        else if (dataPoint[3] && new Date(dataPoint[3]) > date) {
          locations.push(dataPoint);
        }
      });
      return locations;
    },
    [date]
  );
  useEffect(
    () => {
      if (!country) return;
      switch (country[0]) {
        case 'N':
          setLocations(getCropsWithDate(cropData.Ndata));
          setBounds([[2.67581510543829, 4.27263784408598], [14.6557188034058, 13.8920097351076]]);
          break;
        case 'E':
          setLocations(getCropsWithDate(cropData.Edata));
          setBounds([[3.41243791580195, 33.0021171569826], [14.8304491043093, 47.9582290649417]]);
          break;
        case 'K':
          setLocations(getCropsWithDate(cropData.Kdata));
          setBounds([[-4.66606140136707, 33.913948059082], [5.05815601348894, 41.9262161254886]]);
          break;
        default:
          break;
      }
    },
    [country, getCropsWithDate]
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
    <MapContainer className={styles.homeMap} zoom={5} bounds={bounds}>
      <Fragment>
        <TileLayer
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          attribution='&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors'
        />
        {locations &&
          locations.map((location, index) => {
            const popup = location[3]
              ? filter !== 'nCollected' ? blueIcon : null
              : filter === 'all' || filter === 'nCollected' ? redIcon : null;
            return popup ? (
              <Marker
                key={index}
                position={[location[0], location[1]]}
                icon={
                  location[3] ? (
                    filter !== 'nCollected' && blueIcon
                  ) : (
                    (filter === 'all' || filter === 'nCollected') && redIcon
                  )
                }
              >
                <Popup>{location[3] ? location[2] + ' at ' + location[3] : location[2]}</Popup>
              </Marker>
            ) : null;
          })}
        {country === 'Nigeria' && !enhance && <GJSON data={data.Nigeria1} />}
        {country === 'Nigeria' && enhance && <GJSON data={data.Nigeria2} />}
        {country === 'Kenya' && !enhance && <GJSON data={data.Kenya1} />}
        {country === 'Kenya' && enhance && <GJSON data={data.Kenya2} />}
        {country === 'Ethiopia' && !enhance && <GJSON data={data.Ethiopia1} />}
        {country === 'Ethiopia' && enhance && <GJSON data={data.Ethiopia2} />}

        <ChangeMapView bounds={bounds} country={country} />
      </Fragment>
    </MapContainer>
  );
}
