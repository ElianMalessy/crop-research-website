import Head from 'next/head';
import Map from '../components/Map/index';
import Histogram from '../components/Graph/Histogram';
import classes from '../../styles/Home.module.css';
import { useState, Fragment, useEffect, useRef, createContext } from 'react';
import {
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Grid,
  GridItem,
  useColorMode,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderTrack,
  RangeSliderThumb,
  Tooltip,
  Center
} from '@chakra-ui/react';
import { ChevronDownIcon, SunIcon, MoonIcon } from '@chakra-ui/icons';
import axios from 'axios';

export const ClickContext = createContext();
export const CountryContext = createContext();
export const CropContext = createContext();
export const DataContext = createContext();

export default function Home(props) {
  const { colorMode, toggleColorMode } = useColorMode();
  const [country, setCountry] = useState();
  const [crop, setCrop] = useState();
  const [clicked, setClicked] = useState();
  const [enhance, setEnhance] = useState('0');
  const [filter, setFilter] = useState('all');
  const [data, setData] = useState();

  const [tooltipIsOpen, setTooltipIsOpen] = useState(false);
  const startingDate = new Date('2022-05-01').toGMTString();
  const endingDate = new Date('2022-08-09').toGMTString();
  const [startDate, setStartDate] = useState(startingDate);
  const [endDate, setEndDate] = useState(endingDate);
  const dateDifference = Math.floor(new Date(new Date(endingDate) - new Date(startingDate)) / 86400000);

  useEffect(() => {
    async function getData() {
      const initialRes = await axios.get('/api/getInitialData');
      setData(initialRes.data);

      const res = await axios.get('/api');
      setData([Object.assign(initialRes.data, res.data)]);
    }
    getData();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      setTooltipIsOpen(true);
    }, 500);
    return () => t;
  }, []);

  return (
    <Flex w='100%' h='100%' p='1rem'>
      <Head>
        <title>Africa Crop Data Collection and Research Map</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Grid templateColumns='repeat(36, 1fr)' gap={2} w='100%'>
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
                  Country
                </MenuButton>
                <MenuList minW='12rem'>
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
                {country ? (
                  <MenuButton as={Button} rightIcon={<ChevronDownIcon />} w='100%'>
                    Boundaries
                  </MenuButton>
                ) : (
                  <MenuButton
                    as={Button}
                    rightIcon={<ChevronDownIcon />}
                    w='100%'
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    Boundaries
                  </MenuButton>
                )}
                <MenuList minW='12rem'>
                  <MenuItem onClick={() => setEnhance('0')}>Level 0</MenuItem>
                  <MenuItem onClick={() => setEnhance('1')}>Level 1</MenuItem>
                  <MenuItem onClick={() => setEnhance('2')}>Level 2</MenuItem>
                </MenuList>
              </Menu>
            </GridItem>
            <GridItem>
              <Menu>
                {country ? (
                  <MenuButton as={Button} rightIcon={<ChevronDownIcon />} w='100%'>
                    Crops
                  </MenuButton>
                ) : (
                  <MenuButton
                    as={Button}
                    rightIcon={<ChevronDownIcon />}
                    w='100%'
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    Crops
                  </MenuButton>
                )}
                <MenuList minW='12rem'>
                  {country &&
                    Object.keys(props[country + 'Points'].features[0].properties).map((objKey, index) => {
                      if (objKey !== 'ID' && objKey !== 'date')
                        return (
                          <MenuItem key={index} onClick={() => setCrop(objKey)}>
                            {objKey[0].toUpperCase() + objKey.slice(1, objKey.length)}
                          </MenuItem>
                        );
                    })}
                </MenuList>
              </Menu>
            </GridItem>
            <GridItem>
              <Menu>
                {country ? (
                  <MenuButton as={Button} rightIcon={<ChevronDownIcon />} w='100%'>
                    Filter
                  </MenuButton>
                ) : (
                  <MenuButton
                    as={Button}
                    rightIcon={<ChevronDownIcon />}
                    w='100%'
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    Filter
                  </MenuButton>
                )}
                <MenuList minW='12rem'>
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

          <DataContext.Provider value={data}>
            <CountryContext.Provider value={country}>
              <CropContext.Provider value={crop}>
                <ClickContext.Provider value={{ clicked, setClicked }}>
                  <Map enhance={enhance} date={[startDate, endDate]} filter={filter} props={props} />
                </ClickContext.Provider>
              </CropContext.Provider>
            </CountryContext.Provider>
          </DataContext.Provider>
        </GridItem>
        <GridItem colSpan={2} />

        <GridItem w='32rem'>
          <Center w='100%'>
            <RangeSlider
              minW='12rem'
              w='15rem'
              mt='2rem'
              defaultValue={[0, dateDifference]}
              min={0}
              max={dateDifference}
              onChange={([val1, val2]) => {
                setStartDate(
                  new Date(new Date(startingDate).setDate(new Date(startingDate).getDate() + val1)).toGMTString()
                );
                setEndDate(
                  new Date(
                    new Date(endingDate).setDate(new Date(endingDate).getDate() + (val2 - dateDifference))
                  ).toGMTString()
                );
                startingDate = new Date('2022-05-01').toGMTString();
                endingDate = new Date('2022-08-09').toGMTString();
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
                {colorMode === 'light' ? (
                  <RangeSliderThumb index={0} bg='gray.800' />
                ) : (
                  <RangeSliderThumb index={0} bg='white' />
                )}
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
                {colorMode === 'light' ? (
                  <RangeSliderThumb index={1} bg='gray.800' />
                ) : (
                  <RangeSliderThumb index={1} bg='white' />
                )}
              </Tooltip>
            </RangeSlider>
          </Center>

            {country === 'Tanzania' ? (
              <Histogram data={props.TanzaniaPoints} />
            ) : country === 'Nigeria' ? (
              <Histogram data={props.NigeriaPoints} />
            ) : country === 'Ethiopia' ? (
              <Histogram data={props.EthiopiaPoints} />
            ) : null}
        </GridItem>
      </Grid>
    </Flex>
  );
}

export async function getStaticProps() {
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
