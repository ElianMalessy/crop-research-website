import { useEffect, useState, Fragment } from 'react';
import { Grid, VStack, Box, GridItem } from '@chakra-ui/react';
import useWindowDimensions from '../Hooks/useWindowDimensions';
import { MenuToggle } from './MenuToggle';
import Backdrop from './Backdrop';
import SelectorButtons from './SelectorButtons';

export default function Navbar() {
  const { height, width } = useWindowDimensions();
  const [isOpen, setIsOpen] = useState(false);
  useEffect(
    () => {
      if (width > 620 && isOpen) setIsOpen(false);
    },
    [isOpen, width]
  );
  return (
    <Grid templateColumns='repeat(10, 1fr)' gap={2} zIndex='10'>
      {width < 620 && (
        <Fragment>
          <MenuToggle isOpen={isOpen} toggle={() => setIsOpen(!isOpen)} />
          {isOpen && (
            <Backdrop>
              <VStack spacing={4}>
                <SelectorButtons SeparatorComponent={Box} />
              </VStack>
            </Backdrop>
          )}
        </Fragment>
      )}
      {width > 620 && <SelectorButtons SeparatorComponent={GridItem} />}
      <GridItem colSpan={3} />
    </Grid>
  );
}
