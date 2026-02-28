import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface LineChartData {
  timestamp: string;
  value: number;
  predicted?: number;
  confidenceLower?: number;
  confidenceUpper?: number;
}

interface LineChartProps {
  data: LineChartData[];
  width?: number;
  height?: number;
  showConfidence?: boolean;
}

export function LineChart({
  data,
  width = 300,
  height = 150,
  showConfidence = true,
}: LineChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Parse timestamps
    const parsedData = data.map(d => ({
      ...d,
      date: new Date(d.timestamp),
    }));

    // Scales
    const xScale = d3.scaleTime()
      .domain(d3.extent(parsedData, d => d.date) as [Date, Date])
      .range([0, innerWidth]);

    const maxValue = d3.max(parsedData, d => 
      Math.max(d.value, d.predicted || 0, d.confidenceUpper || 0)
    ) || 100;
    const minValue = d3.min(parsedData, d => 
      Math.min(d.value, d.predicted || Infinity, d.confidenceLower || Infinity)
    ) || 0;

    const yScale = d3.scaleLinear()
      .domain([Math.max(0, minValue * 0.9), maxValue * 1.1])
      .range([innerHeight, 0]);

    // Confidence band
    if (showConfidence && parsedData[0]?.confidenceLower !== undefined) {
      const areaGenerator = d3.area<typeof parsedData[0]>()
        .x(d => xScale(d.date))
        .y0(d => yScale(d.confidenceLower || 0))
        .y1(d => yScale(d.confidenceUpper || 0))
        .curve(d3.curveMonotoneX);

      g.append('path')
        .datum(parsedData)
        .attr('fill', '#27C59A')
        .attr('fill-opacity', 0.15)
        .attr('d', areaGenerator);
    }

    // Grid lines
    g.selectAll('.grid-line')
      .data(yScale.ticks(5))
      .enter()
      .append('line')
      .attr('class', 'grid-line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', d => yScale(d))
      .attr('y2', d => yScale(d))
      .attr('stroke', '#2A3449')
      .attr('stroke-dasharray', '2,2');

    // Actual value line
    const lineGenerator = d3.line<typeof parsedData[0]>()
      .x(d => xScale(d.date))
      .y(d => yScale(d.value))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(parsedData)
      .attr('fill', 'none')
      .attr('stroke', '#00F0FF')
      .attr('stroke-width', 2)
      .attr('d', lineGenerator);

    // Predicted value line
    if (showConfidence && parsedData[0]?.predicted !== undefined) {
      const predictedLine = d3.line<typeof parsedData[0]>()
        .x(d => xScale(d.date))
        .y(d => yScale(d.predicted || 0))
        .curve(d3.curveMonotoneX);

      g.append('path')
        .datum(parsedData)
        .attr('fill', 'none')
        .attr('stroke', '#27C59A')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '4,4')
        .attr('d', predictedLine);
    }

    // Data points
    g.selectAll('.data-point')
      .data(parsedData.filter((_, i) => i % 4 === 0)) // Show every 4th point
      .enter()
      .append('circle')
      .attr('class', 'data-point')
      .attr('cx', d => xScale(d.date))
      .attr('cy', d => yScale(d.value))
      .attr('r', 3)
      .attr('fill', '#00F0FF')
      .attr('filter', 'drop-shadow(0 0 4px #00F0FF)');

    // X Axis
    const xAxis = g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).ticks(4).tickFormat(d3.timeFormat('%H:%M') as never));

    xAxis.selectAll('text')
      .style('font-family', 'IBM Plex Mono, monospace')
      .style('font-size', '9px')
      .style('fill', '#A9B3C2');

    xAxis.select('.domain').remove();

    // Y Axis
    const yAxis = g.append('g')
      .call(d3.axisLeft(yScale).ticks(5));

    yAxis.selectAll('text')
      .style('font-family', 'IBM Plex Mono, monospace')
      .style('font-size', '9px')
      .style('fill', '#A9B3C2');

    yAxis.select('.domain').remove();

  }, [data, width, height, showConfidence]);

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      className="overflow-visible"
    />
  );
}
