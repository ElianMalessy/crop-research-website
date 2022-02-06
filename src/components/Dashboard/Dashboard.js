import React from 'react';
import { Tabs, Tab, TabList, TabPanels, TabPanel } from '@chakra-ui/react';
import DataTable from './DataTable';
export default function Dashboard({ children, country }) {
  return (
    <Tabs isFitted variant='enclosed' mt='3rem' p='1rem'>
      <TabList>
        <Tab bg='red.700' border='none'>
          One
        </Tab>
        <Tab bg='purple.900' border='none'>
          Two
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel bg='red.700' h='70vh'>
          <DataTable />
        </TabPanel>
        <TabPanel bg='purple.900' h='70vh'>
          {children}
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
