import Head from 'next/head';
import Image from 'next/image';
import Map from '../components/Map/index';
import styles from '../../styles/Home.module.css';
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
  Tooltip
} from '@chakra-ui/react';
import { ChevronDownIcon, SunIcon, MoonIcon } from '@chakra-ui/icons';
import axios from 'axios';
import Cors from 'cors';

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
  const startingDateRef = useRef(new Date(new Date('01 Jan 2022').toDateString()));
  const endingDateRef = useRef(new Date(new Date().toDateString()));
  const [startDate, setStartDate] = useState(startingDateRef.current);
  const [endDate, setEndDate] = useState(endingDateRef.current);
  const dateDifference = useRef(
    Math.floor((new Date(new Date().toDateString()) - new Date(new Date('01 Jan 2022').toDateString())) / 86400000)
  );

  useEffect(() => {
    async function getData() {
      const initialRes = await axios.get('/api/getInitialData');
      setData(initialRes.data);

      const res = await axios.get('/api');
      setData([Object.assign(initialRes.data, res.data)]);
    }
    getData();
  }, []);

  useEffect(() => console.log(dateDifference.current), []);
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
        <GridItem w='100%' colSpan={20}>
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
            <GridItem colSpan={3}>
              <Menu>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon />} w='100%'>
                  Boundaries
                </MenuButton>
                <MenuList minW='12rem'>
                  <MenuItem onClick={() => setEnhance('0')}>Level 0</MenuItem>
                  <MenuItem onClick={() => setEnhance('1')}>Level 1</MenuItem>
                  <MenuItem onClick={() => setEnhance('2')}>Level 2</MenuItem>
                </MenuList>
              </Menu>
            </GridItem>
            <GridItem>
              <Menu>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon />} w='100%'>
                  Crops
                </MenuButton>
                <MenuList minW='12rem'>
                  <MenuItem onClick={() => setCrop('Maize')}>Maize</MenuItem>
                  <MenuItem onClick={() => setCrop('Cowpea')}>Cowpea</MenuItem>
                  <MenuItem onClick={() => setCrop('Cassava')}>Cassava</MenuItem>
                  <MenuItem onClick={() => setCrop('Rice')}>Rice</MenuItem>
                </MenuList>
              </Menu>
            </GridItem>
            <GridItem>
              <Menu>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon />} w='100%'>
                  Filter
                </MenuButton>
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
                  <Map enhance={enhance} date={startDate} filter={filter} props={props} />
                </ClickContext.Provider>
              </CropContext.Provider>
            </CountryContext.Provider>
          </DataContext.Provider>
        </GridItem>
        <GridItem colSpan={2} />
        <GridItem>
          <RangeSlider
            minW='12rem'
            w='12rem'
            mt='2rem'
            defaultValue={[0, dateDifference.current]}
            min={0}
            max={dateDifference.current}
            onChange={([val1, val2]) => {
              setStartDate(
                new Date(
                  new Date(startingDateRef.current.setDate(startingDateRef.current.getDate() + val1)).toDateString()
                )
              );
              setEndDate(
                new Date(
                  new Date(
                    endingDateRef.current.setDate(endingDateRef.current.getDate() + (val2 - dateDifference.current))
                  ).toDateString()
                )
              );
              startingDateRef.current = new Date(new Date('01 Jan 2022').toDateString());
              endingDateRef.current = new Date(new Date().toDateString());
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
              label={startDate.toISOString().substring(0, 10)}
            >
              {colorMode === 'light' ? (
                <RangeSliderThumb index={0} bg='gray.800' />
              ) : (
                <RangeSliderThumb index={0} bg='white' />
              )}
            </Tooltip>
            <Tooltip
              value={dateDifference.current}
              hasArrow
              bg='blue.900'
              color='white'
              placement='bottom'
              isOpen={tooltipIsOpen}
              label={endDate.toISOString().substring(0, 10)}
            >
              {colorMode === 'light' ? (
                <RangeSliderThumb index={1} bg='gray.800' />
              ) : (
                <RangeSliderThumb index={1} bg='white' />
              )}
            </Tooltip>
          </RangeSlider>
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
    props: { TanzaniaPoints, NigeriaPoints, EthiopiaPoints },

    revalidate: 60
  };
}
