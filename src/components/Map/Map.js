import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import styles from '../../../styles/Home.module.css';
import { useState, Fragment, useEffect, useContext, useCallback } from 'react';
import ChangeMapView from './ChangeMapView';
import { CountryContext, CropContext } from '../../pages';

export default function Map({ enhance, date, filter, points, data, types }) {
  const [locations, setLocations] = useState([]);
  const [bounds, setBounds] = useState([[-37.4134523712, -23.357199357], [39.122135968, 54.5994710922]]);
  const country = useContext(CountryContext);
  const crops = useContext(CropContext);
  useEffect(() => {}, [data]);
  const LeafIcon = L.Icon.extend({
    options: {}
  });
  const greenIcon = new LeafIcon({
    iconUrl: 'https://miro.medium.com/max/512/1*nZ9VwHTLxAfNCuCjYAkajg.png',
    iconSize: [10, 10]
  });
  const redIcon = new LeafIcon({
    iconUrl: 'https://miro.medium.com/max/690/1*RPgy25l49WPXioyAJ1oRTA.png',
    iconSize: [10, 10]
  });

  const getCropsWithDate = useCallback(
    (countryPoints) => {
      const locations = [];
      countryPoints.features.forEach((dataPoint) => {
        const matchingCrops = true;
        for (const [key, value] of Object.entries(dataPoint.properties)) {
          if (
            key !== 'ID' &&
            key !== 'date' &&
            key !== 'NAME_1' &&
            key !== 'NAME_2' &&
            key !== 'NAME_3' &&
            key !== 'name' &&
            crops.indexOf(key) === -1 &&
            value !== 0
          ) {
            matchingCrops = false;
          }
        }
        if (matchingCrops) {
          const dataDate = new Date(dataPoint.properties.date);
          if (dataDate >= new Date(date[0]) && dataDate <= new Date(date[1])) {
            locations.push([dataPoint.geometry.coordinates, dataPoint.properties, true]);
          }
          else if (dataDate > new Date(date[1])) {
            locations.push([dataPoint.geometry.coordinates, dataPoint.properties, false]);
          }
        }
      });
      return locations;
    },
    [date, crops]
  );
  useEffect(
    () => {
      if (!country) return;
      switch (country[0]) {
        case 'N':
          setLocations(getCropsWithDate(points.NigeriaPoints));
          setBounds([[2.67581510543829, 4.27263784408598], [14.6557188034058, 13.8920097351076]]);
          break;
        case 'E':
          setLocations(getCropsWithDate(points.EthiopiaPoints));
          setBounds([[3.41243791580195, 33.0021171569826], [14.8304491043093, 47.9582290649417]]);
          break;
        case 'T':
          setLocations(getCropsWithDate(points.TanzaniaPoints));
          setBounds([[-12.19, 29.24], [-0.09, 41.35]]);
          break;
        default:
          break;
      }
    },
    [country, getCropsWithDate, points, crops]
  );

  function onEachRegion(currentCountry, layer) {
    const p = currentCountry.properties;
    if (!p.NAME_1) return;
    layer.bindPopup(
      `<dl><dd><span style="font-weight: 600">${p.NAME_1 === 'AddisAbeba'
        ? 'City' + ':' + p.NAME_1
        : types.lvl1 + ':' + p.NAME_1}</span></dd> ${p.NAME_2
        ? `<dd><span style="font-weight: 550">${types.lvl2 + ':' + p.NAME_2}</dd>`
        : ''} ` +
        (p.NAME_1 && country === 'Nigeria'
          ? `<dd>crops (1ha) </dd> <dd> maize: ${p.maize} </dd>  <dd>cowpea: ${p.cowpea}</dd> <dd> cassava: ${p.cassava}</dd> <dd> rice: ${p.rice}</dd> </dl>`
          : country === 'Ethiopia'
            ? `<dd>crops (1ha) </dd> <dd> maize: ${p.maize} </dd>  <dd>wheat: ${p.wheat}</dd> <dd> bean: ${p.bean}</dd> <dd> tef: ${p.tef}</dd> </dl>`
            : country === 'Tanzania'
              ? `<dd>crops (1ha) </dd> <dd> maize: ${p.maize} </dd>  <dd>bean: ${p.bean}</dd> <dd> cassava: ${p.cassava}</dd> <dd> rice: ${p.rice}</dd> </dl>`
              : '')
    );
  }
  const GJSON = ({ data }) => {
    return <GeoJSON onEachFeature={onEachRegion} data={data} style={{ fillOpacity: 0 }} />;
  };

  const [gJSONData, setGJSONData] = useState();
  useEffect(
    () => {
      if (country && data) {
        if (data[0]) setGJSONData(data[0][country + (enhance ? enhance : '0')]);
        else setGJSONData(data[country + (enhance ? enhance : '0')]);
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
            const popup = location[2]
              ? filter !== 'nCollected' ? greenIcon : null
              : filter === 'all' || !filter || filter === 'nCollected' ? redIcon : null;

            if (!popup) return;
            return (
              <Marker key={index} position={[location[0][1], location[0][0]]} icon={popup}>
                <Popup>
                  <dl>
                    <dd>{popup.options.iconUrl === greenIcon.options.iconUrl ? 'Visited' : 'Not Visited'}</dd>
                    <dd>crops (1ha)</dd>
                    {Object.keys(location[1]).map((objKey, index) => {
                      let n = objKey;
                      switch (objKey) {
                        case 'NAME_1':
                          n = types.lvl1;
                          break;
                        case 'NAME_2':
                          n = types.lvl2;
                          break;
                        case 'name':
                          n = 'Town';
                          break;
                        default:
                          break;
                      }

                      return (
                        <dd key={index}>{`${n}: ${popup.options.iconUrl !== greenIcon.options.iconUrl && n === 'date'
                          ? 'Future'
                          : location[1][objKey]}`}</dd>
                      );
                    })}
                  </dl>
                </Popup>
              </Marker>
            );
          })}
        {gJSONData && <GJSON data={gJSONData} />}

        <ChangeMapView bounds={bounds} country={country} />
      </Fragment>
    </MapContainer>
  );
}
