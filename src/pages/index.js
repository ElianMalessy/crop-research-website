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
  SimpleGrid,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark
} from '@chakra-ui/react';
import { ChevronDownIcon, SunIcon, MoonIcon } from '@chakra-ui/icons';
import DatePicker from '../components/data-picker';

export const ClickContext = createContext();
export const CountryContext = createContext();
export default function Home() {
  const { colorMode, toggleColorMode } = useColorMode();
  const [country, setCountry] = useState();
  const [crop, setCrop] = useState();
  const [clicked, setClicked] = useState();
  const [enhance, setEnhance] = useState();
  const [startDate, setStartDate] = useState(new Date());

  return (
    <Flex w='100%' h='100%' style={{ padding: '1rem' }}>
      <Head>
        <title>Africa Crop Data Collection and Research Map</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Grid templateColumns='repeat(36, 1fr)' gap={2} w='100%'>
        <GridItem w='100%' colSpan={20}>
          <Grid templateColumns='repeat(12, 1fr)' gap={2} w='100%' zIndex='10'>
            <GridItem w='100%'>
              <Button onClick={toggleColorMode}> {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}</Button>
            </GridItem>
            <GridItem w='100%' colSpan={11}>
              <SimpleGrid columns={5} spacing={2}>
                <Menu>
                  <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                    Date
                  </MenuButton>
                  <MenuList>
                    <DatePicker selectedDate={startDate} onChange={(date) => setStartDate(date)} isClearable={false} />
                  </MenuList>
                </Menu>
                <Menu>
                  <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                    Countries
                  </MenuButton>
                  <MenuList>
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
                <Menu>
                  <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                    Crops
                  </MenuButton>
                  <MenuList>
                    <MenuItem onClick={() => setCrop('Maize')}>Maize</MenuItem>
                    <MenuItem onClick={() => setCrop('Cowpea')}>Cowpea</MenuItem>
                    <MenuItem onClick={() => setCrop('Cassava')}>Cassava</MenuItem>
                    <MenuItem onClick={() => setCrop('Rice')}>Rice</MenuItem>
                  </MenuList>
                </Menu>
                <Button onClick={() => setEnhance(enhance === true ? false : true)}>Toggle Enhance</Button>
              </SimpleGrid>
            </GridItem>
          </Grid>

          <CountryContext.Provider value={country}>
            <ClickContext.Provider value={{ clicked, setClicked }}>
              <Map enhance={enhance} />
            </ClickContext.Provider>
          </CountryContext.Provider>
        </GridItem>

        <GridItem w='100%' />
      </Grid>
    </Flex>
  );
}
