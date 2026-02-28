import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface CircularProgressProps {
  value: number;
  maxValue?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  sublabel?: string;
  showTrend?: boolean;
  trend?: 'up' | 'down' | 'neutral';
}

export function CircularProgress({
  value,
  maxValue = 100,
  size = 280,
  strokeWidth = 16,
  color = '#00F0FF',
  label,
  sublabel,
  showTrend = true,
  trend = 'up',
}: CircularProgressProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const radius = (size - strokeWidth) / 2;
    const centerX = size / 2;
    const centerY = size / 2;

    // Background track (partial circle)
    const trackArc = d3.arc()
      .innerRadius(radius - strokeWidth / 2)
      .outerRadius(radius + strokeWidth / 2)
      .startAngle(-Math.PI * 0.75)
      .endAngle(Math.PI * 0.75);

    svg.append('path')
      .attr('d', trackArc as never)
      .attr('transform', `translate(${centerX}, ${centerY})`)
      .attr('fill', '#2A3449');

    // Progress arc
    const progressAngle = (value / maxValue) * (Math.PI * 1.5);
    const progressArc = d3.arc()
      .innerRadius(radius - strokeWidth / 2)
      .outerRadius(radius + strokeWidth / 2)
      .startAngle(-Math.PI * 0.75)
      .endAngle(-Math.PI * 0.75 + progressAngle);

    svg.append('path')
      .attr('d', progressArc as never)
      .attr('transform', `translate(${centerX}, ${centerY})`)
      .attr('fill', color)
      .attr('filter', `drop-shadow(0 0 12px ${color}50)`);

    // Glow effect at the end of progress
    const endAngle = -Math.PI * 0.75 + progressAngle;
    const endX = centerX + Math.cos(endAngle) * radius;
    const endY = centerY + Math.sin(endAngle) * radius;

    svg.append('circle')
      .attr('cx', endX)
      .attr('cy', endY)
      .attr('r', strokeWidth / 2 + 2)
      .attr('fill', color)
      .attr('filter', `drop-shadow(0 0 8px ${color})`);

    // Inner content area
    svg.append('circle')
      .attr('cx', centerX)
      .attr('cy', centerY)
      .attr('r', radius - strokeWidth - 20)
      .attr('fill', '#111827')
      .attr('stroke', '#2A3449')
      .attr('stroke-width', 1);

    // Main value
    svg.append('text')
      .attr('x', centerX)
      .attr('y', centerY - 15)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .style('font-family', 'Space Grotesk, sans-serif')
      .style('font-size', '72px')
      .style('font-weight', '700')
      .style('fill', '#F2F5F9')
      .text(Math.round(value));

    // Max value
    svg.append('text')
      .attr('x', centerX + 55)
      .attr('y', centerY - 25)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .style('font-family', 'Inter, sans-serif')
      .style('font-size', '16px')
      .style('font-weight', '500')
      .style('fill', '#A9B3C2')
      .text(`/${maxValue}`);

    // Trend indicator
    if (showTrend) {
      const trendColor = trend === 'up' ? '#27C59A' : trend === 'down' ? '#FF4D6D' : '#A9B3C2';
      const trendSymbol = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→';
      
      svg.append('text')
        .attr('x', centerX)
        .attr('y', centerY + 35)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .style('font-family', 'IBM Plex Mono, monospace')
        .style('font-size', '14px')
        .style('font-weight', '600')
        .style('fill', trendColor)
        .text(`${trendSymbol} ${Math.abs(value - 75).toFixed(1)}%`);
    }

    // Label
    if (label) {
      svg.append('text')
        .attr('x', centerX)
        .attr('y', centerY + 65)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .style('font-family', 'IBM Plex Mono, monospace')
        .style('font-size', '10px')
        .style('font-weight', '500')
        .style('letter-spacing', '0.12em')
        .style('fill', '#A9B3C2')
        .style('text-transform', 'uppercase')
        .text(label);
    }

    // Sublabel
    if (sublabel) {
      svg.append('text')
        .attr('x', centerX)
        .attr('y', centerY + 82)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .style('font-family', 'Inter, sans-serif')
        .style('font-size', '11px')
        .style('fill', color)
        .text(sublabel);
    }

  }, [value, maxValue, size, strokeWidth, color, label, sublabel, showTrend, trend]);

  return (
    <svg
      ref={svgRef}
      width={size}
      height={size}
      className="overflow-visible"
    />
  );
}
