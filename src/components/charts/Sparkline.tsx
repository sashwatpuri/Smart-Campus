import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  fillArea?: boolean;
  strokeWidth?: number;
}

export function Sparkline({
  data,
  width = 120,
  height = 40,
  color = '#00F0FF',
  fillArea = true,
  strokeWidth = 2,
}: SparklineProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 4, right: 4, bottom: 4, left: 4 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = d3.scaleLinear()
      .domain([0, data.length - 1])
      .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data) || 100])
      .range([innerHeight, 0]);

    const line = d3.line<number>()
      .x((_, i) => xScale(i))
      .y(d => yScale(d))
      .curve(d3.curveMonotoneX);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Gradient definition
    if (fillArea) {
      const gradientId = `sparkline-gradient-${Math.random().toString(36).substr(2, 9)}`;
      const gradient = svg.append('defs')
        .append('linearGradient')
        .attr('id', gradientId)
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '0%')
        .attr('y2', '100%');

      gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', color)
        .attr('stop-opacity', 0.3);

      gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', color)
        .attr('stop-opacity', 0);

      // Area
      const area = d3.area<number>()
        .x((_, i) => xScale(i))
        .y0(innerHeight)
        .y1(d => yScale(d))
        .curve(d3.curveMonotoneX);

      g.append('path')
        .datum(data)
        .attr('fill', `url(#${gradientId})`)
        .attr('d', area);
    }

    // Line
    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', color)
      .attr('stroke-width', strokeWidth)
      .attr('stroke-linecap', 'round')
      .attr('stroke-linejoin', 'round')
      .attr('d', line);

    // End point dot
    const lastPoint = data[data.length - 1];
    g.append('circle')
      .attr('cx', xScale(data.length - 1))
      .attr('cy', yScale(lastPoint))
      .attr('r', 3)
      .attr('fill', color)
      .attr('filter', `drop-shadow(0 0 4px ${color})`);

  }, [data, width, height, color, fillArea, strokeWidth]);

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      className="overflow-visible"
    />
  );
}
