import { Tabs, Tab, TabList, TabPanels, TabPanel } from '@chakra-ui/react';
import { Fragment } from 'react';
import DataTable from './DataTable';
export default function Dashboard({ children, color }) {
  return (
    <Tabs isFitted variant='enclosed' mt='3rem'>
      {color === 'dark' && (
        <Fragment>
          <TabList>
            <Tab bg='gray.900' border='none' color='white'>
              Table
            </Tab>
            <Tab bg='blue.900' border='none' color='white'>
              Graph
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel bg='gray.900' h={['40vh', '68vh']} overflow='hidden'>
              <DataTable />
            </TabPanel>
            <TabPanel bg='blue.900' h={['40vh', '68vh']}>
              {children}
            </TabPanel>
          </TabPanels>
        </Fragment>
      )}
      {color === 'light' && (
        <Fragment>
          <TabList>
            <Tab bg='gray.200' border='none' color='black'>
              Table
            </Tab>
            <Tab bg='blue.900' border='none' color='white'>
              Graph
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel bg='gray.200' h={['40vh', '68vh']} overflow='hidden'>
              <DataTable />
            </TabPanel>
            <TabPanel bg='blue.900' h={['40vh', '68vh']}>
              {children}
            </TabPanel>
          </TabPanels>
        </Fragment>
      )}
    </Tabs>
  );
}
