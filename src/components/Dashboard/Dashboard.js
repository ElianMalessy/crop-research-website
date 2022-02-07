import { Tabs, Tab, TabList, TabPanels, TabPanel } from '@chakra-ui/react';
import DataTable from './DataTable';
import useWindowDimensions from '../Hooks/useWindowDimensions';
export default function Dashboard({ children, country }) {
  return (
    <Tabs isFitted variant='enclosed' mt='2rem' p='1rem'>
      <TabList>
        <Tab bg='gray.900' border='none'>
          Table
        </Tab>
        <Tab bg='blue.900' border='none'>
          Graph
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel bg='gray.900' h='68vh'>
          <DataTable />
        </TabPanel>
        <TabPanel bg='blue.900' h='68vh'>
          {children}
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
