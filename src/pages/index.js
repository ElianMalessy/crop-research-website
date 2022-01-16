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
  SimpleGrid
} from '@chakra-ui/react';
import { ChevronDownIcon, SunIcon, MoonIcon } from '@chakra-ui/icons';
import DatePicker from '../components/date-picker';
import axios from 'axios';

export const ClickContext = createContext();
export const CountryContext = createContext();
export const CropContext = createContext();
export const DataContext = createContext();

export default function Home() {
  const { colorMode, toggleColorMode } = useColorMode();
  const [country, setCountry] = useState();
  const [crop, setCrop] = useState();
  const [clicked, setClicked] = useState();
  const [enhance, setEnhance] = useState();
  const [startDate, setStartDate] = useState(new Date());
  const [data, setData] = useState();
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    async function getData() {
      const res = await axios.get('/api');
      setData(res.data);
    }
    getData();
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
                  Date
                </MenuButton>
                <MenuList minW='8rem' w='8rem'>
                  <DatePicker selectedDate={startDate} onChange={(date) => setStartDate(date)} isClearable={false} />
                </MenuList>
              </Menu>
            </GridItem>
            <GridItem>
              <Menu>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon />} w='100%'>
                  Countries
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
                      setCountry('Kenya');
                      setClicked(true);
                    }}
                  >
                    Kenya
                  </MenuItem>
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
                  <MenuItem onClick={() => setFilter('nCollected')}>Not Collected</MenuItem>
                </MenuList>
              </Menu>
            </GridItem>
            <GridItem colSpan={3} />
            <GridItem colSpan={2}>
              <Button w='100%' onClick={() => setEnhance(enhance ? false : true)}>
                {enhance ? 'Unenhance' : 'Enhance'}
              </Button>
            </GridItem>
          </Grid>
          <DataContext.Provider value={data}>
            <CountryContext.Provider value={country}>
              <CropContext.Provider value={crop}>
                <ClickContext.Provider value={{ clicked, setClicked }}>
                  <Map enhance={enhance} date={startDate} filter={filter} />
                </ClickContext.Provider>
              </CropContext.Provider>
            </CountryContext.Provider>
          </DataContext.Provider>
        </GridItem>
      </Grid>
    </Flex>
  );
}
