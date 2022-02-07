import { useContext } from 'react';
import { Table, Thead, Tr, Th, Tbody, Td } from '@chakra-ui/react';
import { CropContext } from '../../pages';

export default function DataTable() {
  const crops = useContext(CropContext);
  console.log(crops)
  return (
    <Table size='sm'>
      <Thead>
        <Tr>
          <Th>Crops</Th>
          <Th >
            Visited
          </Th>
          <Th >
            Not Visited
          </Th>
        </Tr>
      </Thead>
      <Tbody>
        {crops && 
        <>
        <Tr><Td>{crops[0]}</Td></Tr>
        <Tr><Td>{crops[1]}</Td></Tr>
        <Tr><Td>{crops[2]}</Td></Tr>
        <Tr><Td>{crops[3]}</Td></Tr>
        </>
      }
      </Tbody>
    </Table>
  );
}
