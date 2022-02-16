import { Fragment, useContext, useEffect, useState } from 'react';
import { Table, Thead, Tr, Th, Tbody, Td } from '@chakra-ui/react';
import { CountryCropContext, DataContext, DateContext } from '../../pages';
import classes from '../../../styles/Home.module.css';
export default function DataTable() {
  const crops = useContext(CountryCropContext);
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
    <Table size='lg' w='100%' whiteSpace='nowrap' className={classes.table}>
      <Thead>
        <Tr>
          <Th>Crops</Th>
          <Th isNumeric>Visited</Th>
          <Th isNumeric>Not Visited</Th>
        </Tr>
      </Thead>
      <Tbody>
        {crops && (
          <Fragment>
            {crops.map((crop, index) => {
              return (
                <Tr key={index}>
                  <Td>{crop[0].toUpperCase() + crop.slice(1, crop.length)}</Td>
                  <Td isNumeric>{cropVals[index][0] + ' (ha)'} </Td>
                  <Td isNumeric>{cropVals[index][1] + ' (ha)'} </Td>
                </Tr>
              );
            })}
          </Fragment>
        )}
      </Tbody>
    </Table>
  );
}
