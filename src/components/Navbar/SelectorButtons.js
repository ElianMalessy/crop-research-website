import { Fragment, useContext } from 'react';
import { Button, Menu, MenuButton, MenuList, MenuItem, Checkbox, useColorMode } from '@chakra-ui/react';
import { MoonIcon, SunIcon, ChevronDownIcon } from '@chakra-ui/icons';
import MButton from '../MenuButton/MButton';
import {
  CountryContext,
  TypesContext,
  EnhanceContext,
  FilterContext,
  ClickContext,
  CountryCropContext,
  CurrCropContext
} from '../../pages';
import countries from './countries';

export default function SelectorButtons({ SeparatorComponent }) {
  const { enhance, setEnhance } = useContext(EnhanceContext);
  const { country, setCountry } = useContext(CountryContext);
  const { filter, setFilter } = useContext(FilterContext);
  const { currCrops, setCurrCrops } = useContext(CurrCropContext);
  const { setClicked } = useContext(ClickContext);
  const types = useContext(TypesContext);
  const countryCrops = useContext(CountryCropContext);

  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Fragment>
      <SeparatorComponent>
        <Button onClick={toggleColorMode}>{colorMode === 'light' ? <MoonIcon /> : <SunIcon />}</Button>
      </SeparatorComponent>
      <SeparatorComponent>
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />} w='100%'>
            {country ? country : 'Select a Country'}
          </MenuButton>
          <MenuList maxW='12rem'>
            {countries.map((c, index) => {
              return (
                <MenuItem
                  key={index}
                  onClick={() => {
                    setCountry(c);
                    setClicked(true);
                  }}
                >
                  {c}
                </MenuItem>
              );
            })}
          </MenuList>
        </Menu>
      </SeparatorComponent>
      <SeparatorComponent>
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
      </SeparatorComponent>
      <SeparatorComponent>
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
      </SeparatorComponent>
      <SeparatorComponent>
        <Menu key={4}>
          <MButton
            country={country}
            text={filter ? filter[0] === 'c' ? 'Collected' : filter[0] === 'n' ? 'Planned' : 'All' : 'Filter'}
          />

          <MenuList maxW='12rem'>
            <MenuItem onClick={() => setFilter('all')}>
              All
              <span style={{ fontStyle: 'italic', color: 'grey', marginLeft: 'auto', marginRight: '0' }}>default</span>
            </MenuItem>
            <MenuItem onClick={() => setFilter('collected')}>Collected</MenuItem>
            <MenuItem onClick={() => setFilter('nCollected')}>Planned</MenuItem>
          </MenuList>
        </Menu>
      </SeparatorComponent>
    </Fragment>
  );
}
