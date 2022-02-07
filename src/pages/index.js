import Head from 'next/head';
import Map from '../components/Map/index';
import Histogram from '../components/Graph/Histogram';
import Dashboard from '../components/Dashboard/Dashboard';
import classes from '../../styles/Home.module.css';
import { useState, Fragment, useEffect, useRef, createContext } from 'react';
import {
  Flex,
  Menu,
  MenuList,
  MenuItem,
  Button,
  Grid,
  GridItem,
  MenuButton,
  useColorMode,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderTrack,
  RangeSliderThumb,
  Tooltip,
  Center,
  Checkbox,
  useColorModeValue,
  Box
} from '@chakra-ui/react';
import { ChevronDownIcon, SunIcon, MoonIcon } from '@chakra-ui/icons';
import MButton from '../components/MenuButton/MButton';
import axios from 'axios';

export const ClickContext = createContext();
export const CountryContext = createContext();
export const CropContext = createContext();

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

 
  useEffect(() => {
    async function getData() {
      // gets initial level 0 data for better user experience as otherwise data loads too slow
      const initialRes = await axios.get('/api/getInitialData');
      setData(initialRes.data);

      const res = await axios.get('/api');
      // combines the data objects
      const obj = Object.assign(initialRes.data, res.data);
      setData([obj]);
    }
    getData();
  }, []);

  useEffect(
    () => {
      if (country && data && data[0]) {
        console.log(data[0][country + '1']);
        setTypes({
          lvl1: data[0][country + '1'].features[0].properties.ENGTYPE_1,
          lvl2: data[0][country + '2'].features[0].properties.ENGTYPE_2
        });
      }
    },
    [data, country]
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
    <Flex w='100vw' h='100vh' p='1rem'>
      <Head>
        <title>Africa Crop Data Collection and Research Map</title>
        <link rel='icon' href='/favicon.ico' />
        <meta name='viewport' content='width=device-width,initial-scale=1' />
      </Head>
      <Grid templateColumns='repeat(30, 1fr)' gap={2} w='100%'>
        <GridItem w='100%'>
          <Grid templateColumns='repeat(10, 1fr)' gap={2} zIndex='10'>
            <GridItem colSpan={1} mr='0.25rem'>
              <Button w='90%' onClick={toggleColorMode}>
                {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              </Button>
            </GridItem>

            <GridItem>
              <Menu>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon />} w='100%'>
                  {country ? country : 'Select a Country'}
                </MenuButton>
                <MenuList maxW='12rem'>
                  <MenuItem
                    onClick={() => {
                      setCountry('Nigeria');
                      setClicked(true);
                    }}
                  >
                    Nigeria
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setCountry('Ethiopia');
                      setClicked(true);
                    }}
                  >
                    Ethiopia
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setCountry('Tanzania');
                      setClicked(true);
                    }}
                  >
                    Tanzania
                  </MenuItem>
                </MenuList>
              </Menu>
            </GridItem>
            <GridItem>
              <Menu>
                <MButton
                  country={country}
                  text={
                    enhance ? enhance === '0' ? (
                      'Country'
                    ) : enhance === '1' ? (
                      types.lvl1
                    ) : enhance === '2' ? (
                      types.lvl2
                    ) : null : (
                      'Boundaries'
                    )
                  }
                />
                <MenuList maxW='12rem'>
                  <MenuItem onClick={() => setEnhance('0')}>Country</MenuItem>
                  <MenuItem onClick={() => setEnhance('1')}>{types.lvl1}</MenuItem>
                  <MenuItem onClick={() => setEnhance('2')}>{types.lvl2}</MenuItem>
                </MenuList>
              </Menu>
            </GridItem>
            <GridItem>
              <Menu closeOnSelect={false}>
                <MButton country={country} text='Crops' />

                <MenuList maxW='12rem'>
                  {country &&
                    countryCrops.map((crop, index) => {
                      return (
                        <MenuItem key={index}>
                          <Checkbox
                            isChecked={Array.isArray(currCrops) && currCrops.indexOf(crop) !== -1}
                            onChange={(e) => {
                              if (e.target.checked) {
                                const tempCurrCrops = currCrops.slice();
                                tempCurrCrops.push(crop);
                                setCurrCrops(tempCurrCrops);
                              }
                              else if (currCrops.indexOf(crop) >= 0) {
                                const tempCurrCrops = currCrops.filter((t) => t !== crop);
                                setCurrCrops(tempCurrCrops);
                              }
                            }}
                          >
                            {crop[0].toUpperCase() + crop.slice(1, crop.length)}
                          </Checkbox>
                        </MenuItem>
                      );
                    })}
                </MenuList>
              </Menu>
            </GridItem>
            <GridItem>
              <Menu>
                <MButton country={country} text={filter ? filter : 'Filter'} />

                <MenuList maxW='12rem'>
                  <MenuItem onClick={() => setFilter('all')}>
                    All
                    <span style={{ fontStyle: 'italic', color: 'grey', marginLeft: 'auto', marginRight: '0' }}>
                      default
                    </span>
                  </MenuItem>
                  <MenuItem onClick={() => setFilter('collected')}>Collected</MenuItem>
                  <MenuItem onClick={() => setFilter('nCollected')}>Planned</MenuItem>
                </MenuList>
              </Menu>
            </GridItem>
            <GridItem colSpan={3} />
          </Grid>

          <CountryContext.Provider value={country}>
            <CropContext.Provider value={currCrops}>
              <ClickContext.Provider value={{ clicked, setClicked }}>
                <Map
                  enhance={enhance}
                  date={[startDate, endDate]}
                  filter={filter}
                  points={props}
                  data={data}
                  types={types}
                />
              </ClickContext.Provider>
            </CropContext.Provider>
          </CountryContext.Provider>
        </GridItem>
        <GridItem colSpan={10} />

        <GridItem w='36rem'>
          <Center w='100%'>
            <RangeSlider
              maxW='15rem'
              mt='2rem'
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
          <Box>
            {country && (
              <CropContext.Provider value={currCrops}>
                <Dashboard country={country}>
                  {country === 'Tanzania' ? (
                    <Histogram crops={countryCrops} data={props.TanzaniaPoints} color={colorMode} />
                  ) : country === 'Nigeria' ? (
                    <Histogram crops={countryCrops} data={props.NigeriaPoints} color={colorMode} />
                  ) : country === 'Ethiopia' ? (
                    <Histogram crops={countryCrops} data={props.EthiopiaPoints} color={colorMode} />
                  ) : null}
                </Dashboard>
              </CropContext.Provider>
            )}
          </Box>
        </GridItem>
        <GridItem colSpan={3} />
      </Grid>
    </Flex>
  );
}

export async function getServerSideProps() {
  let TanzaniaPoints;
  let NigeriaPoints;
  let EthiopiaPoints;

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
