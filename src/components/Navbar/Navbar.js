import { Fragment, useEffect, useState } from 'react';
import { Grid, GridItem, VStack, Box } from '@chakra-ui/react';
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
          <GridItem>
            <MenuToggle isOpen={isOpen} toggle={() => setIsOpen(!isOpen)} />
            {isOpen && (
              <Backdrop>
                <VStack spacing={4}>
                  <SelectorButtons SeparatorComponent={Box} />
                </VStack>
              </Backdrop>
            )}
          </GridItem>
        </Fragment>
      )}
      {width > 620 && <SelectorButtons SeparatorComponent={GridItem} />}
      <GridItem colSpan={3} />
    </Grid>
  );
}
