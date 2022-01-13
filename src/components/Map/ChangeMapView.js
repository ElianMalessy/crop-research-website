import { useMap } from 'react-leaflet';
import { useEffect, useContext, useRef } from 'react';
import { ClickContext, CountryContext } from '../../pages';
export default function ChangeMapView({ bounds }) {
  const { clicked, setClicked } = useContext(ClickContext);
  const country = useContext(CountryContext);
  const map = useMap();
  const boundsRef = useRef(bounds);
  const countryRef = useRef(country);

  useEffect(
    () => {
      console.log(clicked, country, countryRef === country, boundsRef.current === bounds);
      if (
        clicked === true &&
        ((boundsRef.current !== bounds && countryRef.current !== country) ||
          (boundsRef.current === bounds && countryRef.current) === country)
      ) {
        map.fitBounds(bounds);
        boundsRef.current = bounds;
        countryRef.current = country;
        setClicked(false);
      }
    },
    [bounds, map, clicked, setClicked, country]
  );

  return null;
}