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

export const ClickContext = createContext();
export const CountryContext = createContext();
export default function Home() {
  const { colorMode, toggleColorMode } = useColorMode();
  const [country, setCountry] = useState();
  const [crop, setCrop] = useState();
  const [clicked, setClicked] = useState();
  const [enhance, setEnhance] = useState();

  return (
    <Flex w='100%' h='100%' style={{ padding: '1rem' }}>
      <Head>
        <title>Create Next App</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Grid templateColumns='repeat(20, 1fr)' gap={4} w='100%'>
        <GridItem w='100%'>
          <Button onClick={toggleColorMode}> {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}</Button>
        </GridItem>
        <GridItem w='100%' colSpan={10}>
          <CountryContext.Provider value={country}>
            <ClickContext.Provider value={{ clicked, setClicked }}>
              <Map enhance={enhance} />
            </ClickContext.Provider>
          </CountryContext.Provider>
        </GridItem>
        <GridItem w='100%' colSpan={1}>
          <Button onClick={() => setEnhance(enhance === true ? false : true)}>Toggle Enhance</Button>
        </GridItem>
        <GridItem w='100%' colSpan={4} />
        <GridItem w='100%' colSpan={4}>
          <SimpleGrid columns={2} spacing={2}>
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
                <MenuItem onClick={() => setCrop('m1')}>Maize 1</MenuItem>
                <MenuItem onClick={() => setCrop('m1')}>Maize 2</MenuItem>
                <MenuItem onClick={() => setCrop('m1')}>Maize 3</MenuItem>
              </MenuList>
            </Menu>
          </SimpleGrid>
        </GridItem>
      </Grid>
    </Flex>
  );
}
