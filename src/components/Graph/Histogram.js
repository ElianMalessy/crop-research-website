import * as d3 from 'd3';
import useD3 from '../Hooks/useD3';
import { useEffect, useRef } from 'react';

export default function Histogram({ data }) {
  const crop = useRef([]);
  const cropValues = useRef([0, 0, 0]);

  useEffect(
    () => {
      crop.current = [];
      cropValues.current = [0, 0, 0];
      for (const [key, value] of Object.entries(data.features[0].properties)) {
        if (key !== 'ID' && key !== 'date') crop.current.push(key);
      }
      const len = data.features.length;
      for (let i = 0; i < len; i++) {
        const values = data.features[i].properties;
        cropValues.current[0] += values[crop.current[0]];
        cropValues.current[1] += values[crop.current[1]];
        cropValues.current[2] += values[crop.current[2]];
      }
    },
    [data]
  );

  const ref = useD3(
    (svg) => {
      const height = 500;
      const width = 500;
      const margin = { top: 20, right: 30, bottom: 30, left: 40 };

      const x = d3.scaleBand().domain(crop.current).rangeRound([margin.left, width - margin.right]).padding(0.1);

      const y = d3
        .scaleLinear()
        .domain([0, d3.max(cropValues.current)])
        .rangeRound([height - margin.bottom, margin.top]);

      const xAxis = (g) => g.attr('transform', `translate(0,${height - margin.bottom})`).call(d3.axisBottom(x));

      const yAxis = (g) =>
        g
          .attr('transform', `translate(${margin.left},0)`)
          .style('color', 'steelblue')
          .call(d3.axisLeft(y).ticks(null, 's'))
          .call((g) => g.select('.domain').remove())
          .call((g) =>
            g
              .append('text')
              .attr('x', -margin.left)
              .attr('y', 10)
              .attr('fill', 'currentColor')
              .attr('text-anchor', 'start')
              .text(data.y)
          );

      svg.select('.x-axis').call(xAxis);
      svg.select('.y-axis').call(yAxis);

      svg
        .select('.plot-area')
        .attr('fill', 'steelblue')
        .selectAll('.bar')
        .data(data)
        .join('rect')
        .attr('class', 'bar')
        .attr('x', (d) => x(d.crop))
        .attr('width', x.bandwidth())
        .attr('y', (d) => y(d.sales))
        .attr('height', (d) => y(0) - y(d.sales));
    },
    [data]
  );

  return (
    <svg
      ref={ref}
      style={{
        height: 500,
        width: '100%',
        marginRight: '0px',
        marginLeft: '0px',
        transform: 'translate(0, 10vh)'
      }}
    >
      <g className='plot-area' />
      <g className='x-axis' />
      <g className='y-axis' />
    </svg>
  );
}
