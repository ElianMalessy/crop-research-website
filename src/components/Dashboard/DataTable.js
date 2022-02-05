import React from 'react';
import { Table, Thead, Tr, Th, Tbody, Td } from '@chakra-ui/react';

export default function DataTable() {
  return (
    <Table size='sm'>
      <Thead>
        <Tr>
          <Th>Expected</Th>
          <Th>Not Expected</Th>
          <Th>Expected</Th>
          <Th>Not Expected</Th>
        </Tr>
      </Thead>
      <Tbody />
    </Table>
  );
}
