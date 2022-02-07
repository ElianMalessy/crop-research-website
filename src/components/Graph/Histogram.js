import * as d3 from 'd3';
import useD3 from '../Hooks/useD3';
import { useEffect, useRef } from 'react';
import useWindowDimensions from '../Hooks/useWindowDimensions';

export default function Histogram({ crops, data, color }) {
  const cropValues = useRef([0, 0, 0, 0]);
  const dataObj = useRef([]);

  let { height, width } = useWindowDimensions();
  height = 460
  width = 590

  useEffect(
    () => {
      cropValues.current = [0, 0, 0, 0];
      dataObj.current = [];

      const len = data.features.length;
      for (let i = 0; i < len; i++) {
        const values = data.features[i].properties;
        for (let j = 0; j < crops.length; j++) {
          cropValues.current[j] += values[crops[j]];
        }
      }

      // creates object for d3 to read from
      for (let i = 0; i < crops.length; i++) {
        dataObj.current.push({ crop: crops[i], value: cropValues.current[i] });
      }
    },
    [crops, data]
  );

  const ref = useD3(
    (svg) => {
      svg.selectAll('text.y').remove();
      svg.selectAll('text.x').remove();

      const margin = { top: 5, right: 90, bottom: 0, left: 55 };
      const x = d3.scaleBand().domain(crops).rangeRound([margin.left, width - margin.right]).padding(0.1);

      const y = d3
        .scaleLinear()
        .domain([0, Math.ceil(d3.max(cropValues.current) / 10) * 10])
        .rangeRound([height - margin.top, margin.top]);

      const xAxis = (g) => g.attr('transform', `translate(0,${height - margin.top})`).call(d3.axisBottom(x));

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
        .attr('y', height + 25)
        .attr('fill', color === 'light' ? 'black' : '#CBD5E0')
        .text('crops');
      svg
        .append('text')
        .attr('class', 'y label')
        .attr('text-anchor', 'end')
        .attr('x', -height / 3)
        .attr('dy', '1em')
        .attr('fill', color === 'light' ? 'black' : '#CBD5E0')
        .attr('transform', 'rotate(-90)')
        .text('Plots Found');
    },
    [data, height, width, crops, color]
  );

  return (
    <svg
      ref={ref}
      style={{
        height: '100%',
        width: '100%',
        marginRight: '0',
        marginLeft: '0',
        marginTop: '0.75rem'
      }}
    >
      <g className='plot-area' />
      <g className='x-axis' />
      <g className='y-axis' />
    </svg>
  );
}
