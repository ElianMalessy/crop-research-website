import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import styles from '../../../styles/Home.module.css';
import { useState, Fragment, useEffect, useContext, useCallback } from 'react';
import ChangeMapView from './ChangeMapView';
import { CountryContext, DataContext } from '../../pages';

export default function Map({ enhance, date, filter, props }) {
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
    (props) => {
      const locations = [];
      const dataset =
        country[0] === 'N'
          ? props.NigeriaPoints
          : country[0] === 'E' ? props.EthiopiaPoints : country[0] === 'T' ? props.TanzaniaPoints : null;
      if (!dataset) return;
      dataset.features.forEach((dataPoint) => {
        locations.push(dataPoint.geometry.coordinates);
        // if (dataPoint[3] && new Date(dataPoint[3]) <= date) {
        //   locations.push(dataPoint);
        // }
      });
      return locations;
    },
    [country]
  );
  useEffect(
    () => {
      if (!country) return;
      switch (country[0]) {
        case 'N':
          setLocations(getCropsWithDate(props));
          setBounds([[2.67581510543829, 4.27263784408598], [14.6557188034058, 13.8920097351076]]);
          break;
        case 'E':
          setLocations(getCropsWithDate(props));
          setBounds([[3.41243791580195, 33.0021171569826], [14.8304491043093, 47.9582290649417]]);
          break;
        case 'T':
          setLocations(getCropsWithDate(props));
          setBounds([[-12.19, 29.24], [-0.09, 41.35]]);
          break;
        default:
          break;
      }
    },
    [country, getCropsWithDate, props]
  );

  function onEachRegion(country, layer) {
    const props = country.properties;
    layer.bindPopup(
      `<dl> <span style="font-weight: 600">${props.NAME_2
        ? props.NAME_2
        : props.NAME_1 ? props.NAME_1 : props.NAME_0}</span>` +
        (props.NAME_1
          ? `<dd>crops (1000 ha) </dd> <dd> maize: ${props.maize} </dd>  <dd>cowpea: ${props.cowpea}</dd> <dd> cassava: ${props.cassava}</dd> </dl>`
          : '')
    );
  }
  const GJSON = ({ data }) => {
    return <GeoJSON onEachFeature={onEachRegion} data={data} />;
  };

  const [gJSONData, setGJSONData] = useState();
  useEffect(
    () => {
      if (country && enhance && data) {
        if (data[0]) setGJSONData(data[0][country + enhance]);
        else setGJSONData(data[country + enhance]);
      }
    },
    [country, enhance, data]
  );

  return (
    <MapContainer className={styles.homeMap} zoom={5} bounds={bounds}>
      <Fragment>
        <TileLayer
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          attribution='&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors'
        />
        {locations &&
          locations.map((location, index) => {
            // const popup = location[3]
            //   ? filter !== 'nCollected' ? blueIcon : null
            //   : filter === 'all' || filter === 'nCollected' ? redIcon : null;
            return (
              <Marker
                key={index}
                position={[location[1], location[0]]}
                icon={
                  blueIcon
                  // location[3] ? (
                  //   filter !== 'nCollected' && blueIcon
                  // ) : (
                  //   (filter === 'all' || filter === 'nCollected') && redIcon
                  // )
                }
              >
                <Popup>
                  {'Location, found on DATE' /* location[3] ? location[2] + ' at ' + location[3] : location[2] */}
                </Popup>
              </Marker>
              //) : null;
            );
          })}
        {gJSONData && <GJSON data={gJSONData} />}

        <ChangeMapView bounds={bounds} country={country} />
      </Fragment>
    </MapContainer>
  );
}
