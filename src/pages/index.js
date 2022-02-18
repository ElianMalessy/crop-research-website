import Head from 'next/head';
import Map from '../components/Map/index';
import Histogram from '../components/Graph/Histogram';
import Dashboard from '../components/Dashboard/Dashboard';
import classes from '../../styles/Home.module.css';
import { useState, useEffect, useRef, createContext } from 'react';
import {
  Flex,
  Grid,
  GridItem,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderTrack,
  RangeSliderThumb,
  Tooltip,
  Center,
  useColorModeValue,
  useColorMode
} from '@chakra-ui/react';
import axios from 'axios';
import { subdivisions } from '../components/Map/subdivisions';
import useSWR from 'swr';
import Navbar from '../components/Navbar/Navbar';

export const ClickContext = createContext();
export const CountryContext = createContext();
export const CurrCropContext = createContext();
export const DataContext = createContext();
export const DateContext = createContext();
export const TypesContext = createContext();
export const EnhanceContext = createContext();
export const FilterContext = createContext();
export const CountryCropContext = createContext();

export default function Home(props) {
  const { colorMode, toggleColorMode } = useColorMode();
  const thumbColor = useColorModeValue('gray.800', 'white');

  const [country, setCountry] = useState();
  const [countryCrops, setCountryCrops] = useState([]);
  const [currCrops, setCurrCrops] = useState([]);
  const [clicked, setClicked] = useState();
  const [enhance, setEnhance] = useState();
  const [filter, setFilter] = useState();
  const [data, setData] = useState();

  const [tooltipIsOpen, setTooltipIsOpen] = useState(false);
  const startingDate = useRef(new Date('2022-05-01').toGMTString());
  const endingDate = useRef(new Date('2022-07-20').toGMTString());
  const [startDate, setStartDate] = useState(startingDate.current);
  const [endDate, setEndDate] = useState(endingDate.current);
  const dateDifference = Math.floor(new Date(new Date(endingDate.current) - new Date(startingDate.current)) / 86400000);
  const [types, setTypes] = useState({});

  const fetcher = (url) => axios.get(url).then((r) => r.data);
  const { data: res } = useSWR('/api', fetcher);
  if (res && !data) setData([res]);

  useEffect(
    () => {
      if (country) {
        setTypes({
          lvl1: subdivisions[country][0],
          lvl2: subdivisions[country][1]
        });
      }
    },
    [country]
  );
  useEffect(
    () => {
      const arr = [];
      if (!props || !country) return;
      Object.keys(props[country + 'Points'].features[0].properties).map((objKey) => {
        if (
          objKey !== 'ID' &&
          objKey !== 'date' &&
          objKey !== 'NAME_1' &&
          objKey !== 'NAME_2' &&
          objKey !== 'NAME_3' &&
          objKey !== 'name'
        ) {
          arr.push(objKey);
        }
      });
      setCurrCrops(arr);
      setCountryCrops(arr);
    },
    [props, country]
  );

  useEffect(() => {
    const t = setTimeout(() => {
      setTooltipIsOpen(true);
    }, 500);
    return () => t;
  }, []);

  return (
    <Flex w='100vw' h='100vh' p='1rem 2rem 1rem 1rem' overflowX='hidden'>
      <Head>
        <title>Africa Crop Data Collection and Research Map</title>
        <link rel='icon' href='/favicon.ico' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <meta
          name='description'
          content='An interactive Map, Data-table, and Graph using African crop data collected by the IMAGE team which is funded by the Gates Foundation'
        />
      </Head>
      <Grid w='100%' className={classes.grid}>
        <GridItem w='100%'>
          <CountryContext.Provider value={{ country, setCountry }}>
            <ClickContext.Provider value={{ clicked, setClicked }}>
              <CurrCropContext.Provider value={{ currCrops, setCurrCrops }}>
                <TypesContext.Provider value={types}>
                  <EnhanceContext.Provider value={{ enhance, setEnhance }}>
                    <FilterContext.Provider value={{ filter, setFilter }}>
                      <CountryCropContext.Provider value={countryCrops}>
                        <Navbar />
                      </CountryCropContext.Provider>
                    </FilterContext.Provider>
                  </EnhanceContext.Provider>
                </TypesContext.Provider>
              </CurrCropContext.Provider>
              <Map
                date={[startDate, endDate]}
                filter={filter}
                points={props}
                data={data}
                crops={currCrops}
                types={types}
                enhance={enhance}
              />
            </ClickContext.Provider>
          </CountryContext.Provider>
        </GridItem>

        <GridItem minW='36vw' h='40vh' className={classes.rightPanel}>
          <Center w='100%'>
            <RangeSlider
              maxW='15rem'
              mt='3rem'
              aria-label={('min', 'max')}
              aria-valuetext={(startDate, endDate)}
              defaultValue={[0, dateDifference]}
              min={0}
              max={dateDifference}
              onChange={([val1, val2]) => {
                setStartDate(
                  new Date(
                    new Date(startingDate.current).setDate(new Date(startingDate.current).getDate() + val1)
                  ).toGMTString()
                );
                setEndDate(
                  new Date(
                    new Date(endingDate.current).setDate(
                      new Date(endingDate.current).getDate() + (val2 - dateDifference)
                    )
                  ).toGMTString()
                );
                startingDate.current = new Date('2022-05-01').toGMTString();
                endingDate.current = new Date('2022-07-20').toGMTString();
              }}
            >
              <RangeSliderTrack bg='blue.100'>
                <RangeSliderFilledTrack bg='blue.400' />
              </RangeSliderTrack>
              <Tooltip
                value={0}
                hasArrow
                bg='blue.900'
                color='white'
                placement='top'
                isOpen={tooltipIsOpen}
                label={new Date(startDate).toISOString().substring(0, 10)}
              >
                <RangeSliderThumb index={0} bg={thumbColor} />
              </Tooltip>
              <Tooltip
                value={dateDifference}
                hasArrow
                bg='blue.900'
                color='white'
                placement='bottom'
                isOpen={tooltipIsOpen}
                label={new Date(endDate).toISOString().substring(0, 10)}
              >
                <RangeSliderThumb index={1} bg={thumbColor} />
              </Tooltip>
            </RangeSlider>
          </Center>
          {country && (
            <DateContext.Provider value={[startDate, endDate]}>
              <CountryCropContext.Provider value={countryCrops}>
                <DataContext.Provider value={props[country + 'Points'].features}>
                  <Dashboard color={colorMode}>
                    <Histogram color={colorMode} />
                  </Dashboard>
                </DataContext.Provider>
              </CountryCropContext.Provider>
            </DateContext.Provider>
          )}
        </GridItem>
      </Grid>
    </Flex>
  );
}

export async function getServerSideProps({ res }) {
  let TanzaniaPoints;
  let NigeriaPoints;
  let EthiopiaPoints;
  res.setHeader('Cache-Control', 'public, s-maxage=43200, stale-while-revalidate=60');

  try {
    const data = await axios
      .all([
        axios.get('https://seedsurvey.s3.amazonaws.com/json/Tanzania_sample.json'),
        axios.get('https://seedsurvey.s3.amazonaws.com/json/Nigeria_sample.json'),
        axios.get('https://seedsurvey.s3.amazonaws.com/json/Ethiopia_sample.json')
      ])
      .then(
        axios.spread((data1, data2, data3) => {
          TanzaniaPoints = data1.data;
          NigeriaPoints = data2.data;
          EthiopiaPoints = data3.data;
        })
      );
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).end(error.message);
  }

  return {
    props: { TanzaniaPoints, NigeriaPoints, EthiopiaPoints }
  };
}
