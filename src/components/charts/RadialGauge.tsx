import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface RadialGaugeProps {
  value: number;
  maxValue?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label: string;
  sublabel?: string;
}

export function RadialGauge({
  value,
  maxValue = 100,
  size = 200,
  strokeWidth = 12,
  color = '#00F0FF',
  label,
  sublabel,
}: RadialGaugeProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const radius = (size - strokeWidth) / 2;
    const centerX = size / 2;
    const centerY = size / 2;

    // Background arc (full circle)
    const arcGenerator = d3.arc()
      .innerRadius(radius - strokeWidth / 2)
      .outerRadius(radius + strokeWidth / 2)
      .startAngle(0)
      .endAngle(2 * Math.PI);

    svg.append('path')
      .attr('d', arcGenerator as never)
      .attr('transform', `translate(${centerX}, ${centerY})`)
      .attr('fill', '#2A3449');

    // Progress arc
    const progressAngle = (value / maxValue) * 2 * Math.PI;
    const progressArc = d3.arc()
      .innerRadius(radius - strokeWidth / 2)
      .outerRadius(radius + strokeWidth / 2)
      .startAngle(-Math.PI / 2)
      .endAngle(-Math.PI / 2 + progressAngle);

    svg.append('path')
      .attr('d', progressArc as never)
      .attr('transform', `translate(${centerX}, ${centerY})`)
      .attr('fill', color)
      .attr('filter', `drop-shadow(0 0 8px ${color}40)`);

    // Inner circle background
    svg.append('circle')
      .attr('cx', centerX)
      .attr('cy', centerY)
      .attr('r', radius - strokeWidth - 8)
      .attr('fill', '#1A2233')
      .attr('stroke', '#2A3449')
      .attr('stroke-width', 1);

    // Value text
    svg.append('text')
      .attr('x', centerX)
      .attr('y', centerY - 8)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .style('font-family', 'Space Grotesk, sans-serif')
      .style('font-size', '42px')
      .style('font-weight', '700')
      .style('fill', '#F2F5F9')
      .text(`${Math.round(value)}`);

    // Percent symbol
    svg.append('text')
      .attr('x', centerX + 35)
      .attr('y', centerY - 12)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .style('font-family', 'Inter, sans-serif')
      .style('font-size', '16px')
      .style('font-weight', '500')
      .style('fill', '#A9B3C2')
      .text('%');

    // Label
    svg.append('text')
      .attr('x', centerX)
      .attr('y', centerY + 24)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .style('font-family', 'IBM Plex Mono, monospace')
      .style('font-size', '10px')
      .style('font-weight', '500')
      .style('letter-spacing', '0.12em')
      .style('fill', '#A9B3C2')
      .style('text-transform', 'uppercase')
      .text(label);

    // Sublabel
    if (sublabel) {
      svg.append('text')
        .attr('x', centerX)
        .attr('y', centerY + 40)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .style('font-family', 'Inter, sans-serif')
        .style('font-size', '11px')
        .style('fill', color)
        .text(sublabel);
    }
  }, [value, maxValue, size, strokeWidth, color, label, sublabel]);

  return (
    <svg
      ref={svgRef}
      width={size}
      height={size}
      className="overflow-visible"
    />
  );
}
