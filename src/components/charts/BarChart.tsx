import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface BarChartData {
  label: string;
  value: number;
  predicted?: number;
}

interface BarChartProps {
  data: BarChartData[];
  width?: number;
  height?: number;
  showConfidence?: boolean;
}

export function BarChart({
  data,
  width = 300,
  height = 150,
  showConfidence = true,
}: BarChartProps) {
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

    // Scales
    const xScale = d3.scaleBand()
      .domain(data.map(d => d.label))
      .range([0, innerWidth])
      .padding(0.3);

    const maxValue = d3.max(data, d => Math.max(d.value, d.predicted || 0)) || 100;
    const yScale = d3.scaleLinear()
      .domain([0, maxValue * 1.1])
      .range([innerHeight, 0]);

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

    // Bars
    const barWidth = xScale.bandwidth() / (showConfidence && data[0]?.predicted !== undefined ? 2 : 1);

    // Actual values
    g.selectAll('.bar-actual')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar-actual')
      .attr('x', d => xScale(d.label) || 0)
      .attr('y', d => yScale(d.value))
      .attr('width', barWidth)
      .attr('height', d => innerHeight - yScale(d.value))
      .attr('fill', '#00F0FF')
      .attr('rx', 2);

    // Predicted values
    if (showConfidence) {
      g.selectAll('.bar-predicted')
        .data(data.filter(d => d.predicted !== undefined))
        .enter()
        .append('rect')
        .attr('class', 'bar-predicted')
        .attr('x', d => (xScale(d.label) || 0) + barWidth)
        .attr('y', d => yScale(d.predicted || 0))
        .attr('width', barWidth)
        .attr('height', d => innerHeight - yScale(d.predicted || 0))
        .attr('fill', '#27C59A')
        .attr('fill-opacity', 0.6)
        .attr('rx', 2);
    }

    // X Axis
    const xAxis = g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).tickSize(0));

    xAxis.selectAll('text')
      .style('font-family', 'IBM Plex Mono, monospace')
      .style('font-size', '10px')
      .style('fill', '#A9B3C2');

    xAxis.select('.domain').remove();

    // Y Axis
    const yAxis = g.append('g')
      .call(d3.axisLeft(yScale).ticks(5).tickSize(0));

    yAxis.selectAll('text')
      .style('font-family', 'IBM Plex Mono, monospace')
      .style('font-size', '10px')
      .style('fill', '#A9B3C2');

    yAxis.select('.domain').remove();

    // Legend
    const legend = g.append('g')
      .attr('transform', `translate(${innerWidth - 80}, -10)`);

    legend.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 8)
      .attr('height', 8)
      .attr('fill', '#00F0FF')
      .attr('rx', 1);

    legend.append('text')
      .attr('x', 12)
      .attr('y', 7)
      .style('font-family', 'Inter, sans-serif')
      .style('font-size', '9px')
      .style('fill', '#A9B3C2')
      .text('Actual');

    if (showConfidence) {
      legend.append('rect')
        .attr('x', 45)
        .attr('y', 0)
        .attr('width', 8)
        .attr('height', 8)
        .attr('fill', '#27C59A')
        .attr('fill-opacity', 0.6)
        .attr('rx', 1);

      legend.append('text')
        .attr('x', 57)
        .attr('y', 7)
        .style('font-family', 'Inter, sans-serif')
        .style('font-size', '9px')
        .style('fill', '#A9B3C2')
        .text('Predicted');
    }

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
