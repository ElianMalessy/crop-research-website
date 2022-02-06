import React from 'react';
import { Table, Thead, Tr, Th, Tbody, Td } from '@chakra-ui/react';

export default function DataTable() {
  return (
    <Table size='sm'>
      <Thead>
        <Tr>
          <Th colSpan={2} textAlign='center'>
            Found
          </Th>
          <Th colSpan={2} textAlign='center'>
            Not Found
          </Th>
        </Tr>
        <Tr>
          <Th>Expected</Th>
          <Th>Not Expected</Th>
          <Th>Expected</Th>
          <Th>Not Expected</Th>
        </Tr>
      </Thead>
      <Tbody>
        <Tr>
          <Td>inches</Td>
          <Td>millimetres (mm)</Td>
          <Td isNumeric>25.4</Td>
        </Tr>
        <Tr>
          <Td>feet</Td>
          <Td>centimetres (cm)</Td>
          <Td isNumeric>30.48</Td>
        </Tr>
        <Tr>
          <Td>yards</Td>
          <Td>metres (m)</Td>
          <Td isNumeric>0.91444</Td>
        </Tr>
      </Tbody>
    </Table>
  );
}
