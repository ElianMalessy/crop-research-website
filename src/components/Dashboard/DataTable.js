import { Fragment, useContext, useEffect, useState } from 'react';
import { Table, Thead, Tr, Th, Tbody, Td } from '@chakra-ui/react';
import { CropContext, DataContext, DateContext } from '../../pages';

export default function DataTable() {
  const crops = useContext(CropContext);
  const data = useContext(DataContext);
  const date = useContext(DateContext);
  const [cropVals, setCropVals] = useState([[0, 0], [0, 0], [0, 0], [0, 0]]);

  useEffect(
    () => {
      const len = data.length;
      const tempCropVals = [[0, 0], [0, 0], [0, 0], [0, 0]];
      for (let i = 0; i < len; i++) {
        const values = data[i].properties;
        const d = new Date(values.date);
        for (let j = 0; j < crops.length; j++) {
          if (d >= new Date(date[0]) && d <= new Date(date[1]) && values[crops[j]] >= 100) {
            tempCropVals[j][0] += values[crops[j]];
          }
          else if (d > new Date(date[1]) && values[crops[j]] >= 100) {
            tempCropVals[j][1] += values[crops[j]];
          }
        }
      }
      setCropVals(tempCropVals);
    },
    [crops, data, date]
  );
  return (
    <Table size='lg' w='32vw'>
      <Thead>
        <Tr>
          <Th>Crops</Th>
          <Th>Visited</Th>
          <Th>Not Visited</Th>
        </Tr>
      </Thead>
      <Tbody>
        {crops && (
          <Fragment>
            {crops.map((crop, index) => {
              return (
                <Tr key={index}>
                  <Td>{crop}</Td>
                  <Td>{cropVals[index][0] + ' (ha)'} </Td>
                  <Td>{cropVals[index][1] + ' (ha)'} </Td>
                </Tr>
              );
            })}
          </Fragment>
        )}
      </Tbody>
    </Table>
  );
}
