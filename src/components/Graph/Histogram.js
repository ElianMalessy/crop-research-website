import * as d3 from 'd3';
import useD3 from '../Hooks/useD3';
import { useEffect, useRef } from 'react';
import useWindowDimensions from '../Hooks/useWindowDimensions';

export default function Histogram({ data }) {
  const crops = useRef([]);
  const cropValues = useRef([0, 0, 0, 0]);
  const dataObj = useRef([]);

  let { height, width } = useWindowDimensions();
  height /= 100 / 69;
  width /= 3;

  useEffect(() => {
    console.log(height, width);
  });
  useEffect(
    () => {
      crops.current = [];
      cropValues.current = [0, 0, 0, 0];
      dataObj.current = [];

      for (const [key, value] of Object.entries(data.features[0].properties)) {
        if (key !== 'ID' && key !== 'date') crops.current.push(key);
      }
      const len = data.features.length;
      for (let i = 0; i < len; i++) {
        const values = data.features[i].properties;
        for (let j = 0; j < crops.current.length; j++) {
          cropValues.current[j] += values[crops.current[j]];
        }
      }

      // creates object for d3 to read from
      for (let i = 0; i < crops.current.length; i++) {
        dataObj.current.push({ crop: crops.current[i], value: cropValues.current[i] });
      }
    },
    [data]
  );
  const ref = useD3(
    (svg) => {
      svg.selectAll('text.y').remove();
      svg.selectAll('text.x').remove();

      const margin = { top: 0, right: 90, bottom: 50, left: 55 };
      const x = d3.scaleBand().domain(crops.current).rangeRound([margin.left, width - margin.right]).padding(0.1);

      const y = d3
        .scaleLinear()
        .domain([0, Math.ceil(d3.max(cropValues.current) / 10) * 10])
        .rangeRound([height - margin.top, margin.top]);

      const xAxis = (g) => g.call(d3.axisBottom(x));

      const yAxis = (g) =>
        g
          .attr('transform', `translate(${margin.left},0)`)
          .style('color', 'steelblue')
          .call(d3.axisLeft(y).ticks(null, 's'))
          .call((g) => g.select('.domain').remove());

      svg.select('.x-axis').call(xAxis);
      svg.select('.y-axis').call(yAxis);

      svg
        .select('.plot-area')
        .attr('fill', 'steelblue')
        .selectAll('.bar')
        .data(dataObj.current)
        .join('rect')
        .attr('class', 'bar')
        .attr('x', (d) => x(d.crop))
        .attr('width', x.bandwidth())
        .attr('y', (d) => y(d.value))
        .attr('height', (d) => y(0) - y(d.value));

      svg
        .append('text')
        .attr('class', 'x label')
        .attr('text-anchor', 'end')
        .attr('x', width / 2)
        .attr('y', '73vh')
        .text('crops');
      svg
        .append('text')
        .attr('class', 'y label')
        .attr('text-anchor', 'end')
        .attr('x', -height / 3)
        .attr('dy', '0.75em')
        .attr('transform', 'rotate(-90)')
        .text('Plots Found');
    },
    [data, height, width]
  );

  return (
    <svg
      ref={ref}
      style={{
        height: '75vh',
        width: '100%',
        marginRight: '0px',
        marginLeft: '0px',
        transform: 'translate(2vw, 10vh)'
      }}
    >
      <g className='plot-area' />
      <g className='x-axis' style={{ transform: 'translate(0, 69vh)' }} />
      <g className='y-axis' />
    </svg>
  );
}
