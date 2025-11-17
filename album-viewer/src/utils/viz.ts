// Import D3.js library for data visualization and DOM manipulation
import * as d3 from 'd3';

interface SalesData {
  year: number;
  month: string;
  albumsSold: number;
  sellingPrice: number;
}

// generate a plot with D3.js of the selling price of the album by year
// x-axis are the month series and y-axis show the numbers of albums sold
// data from the sales of album are loaded in from an external source and are in json format
export async function generateAlbumSalesChart(
  containerId: string,
  dataSource: string
): Promise<void> {
  try {
    // Load data from external JSON source
    const data = await d3.json<SalesData[]>(dataSource);

    if (!data || data.length === 0) {
      console.error('No data available');
      return;
    }

    // Set dimensions
    const margin = { top: 20, right: 30, bottom: 30, left: 60 };
    const width = 960 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // Create SVG element
    const svg = d3
      .select(`#${containerId}`)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create scales
    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.month))
      .range([0, width])
      .padding(0.1);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.albumsSold) as number])
      .range([height, 0]);

    // Create color scale based on selling price
    const colorScale = d3
      .scaleLinear<string>()
      .domain([
        d3.min(data, (d) => d.sellingPrice) as number,
        d3.max(data, (d) => d.sellingPrice) as number,
      ])
      .range(['#4CAF50', '#FF6B6B']);

    // Create bars
    svg
      .selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d) => xScale(d.month) as number)
      .attr('y', (d) => yScale(d.albumsSold))
      .attr('width', xScale.bandwidth())
      .attr('height', (d) => height - yScale(d.albumsSold))
      .attr('fill', (d) => colorScale(d.sellingPrice))
      .on('mouseover', function () {
        d3.select(this).attr('opacity', 0.7);
      })
      .on('mouseout', function () {
        d3.select(this).attr('opacity', 1);
      });

    // Add X axis
    svg
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .append('text')
      .attr('x', width / 2)
      .attr('y', 40)
      .attr('fill', 'black')
      .attr('text-anchor', 'middle')
      .text('Month');

    // Add Y axis
    svg
      .append('g')
      .call(d3.axisLeft(yScale))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -40)
      .attr('fill', 'black')
      .attr('text-anchor', 'middle')
      .text('Albums Sold');

    // Add title
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', -5)
      .attr('text-anchor', 'middle')
      .attr('font-size', '18px')
      .attr('font-weight', 'bold')
      .text('Album Sales by Month');

    // Add legend for color scale
    const legend = svg
      .append('g')
      .attr('transform', `translate(${width - 200}, 10)`);

    legend
      .append('text')
      .attr('x', 0)
      .attr('y', 0)
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .text('Selling Price');

    const legendGradient = legend
      .append('defs')
      .append('linearGradient')
      .attr('id', 'legend-gradient')
      .attr('x1', '0%')
      .attr('x2', '100%');

    legendGradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#4CAF50');

    legendGradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#FF6B6B');

    legend
      .append('rect')
      .attr('width', 150)
      .attr('height', 10)
      .attr('y', 10)
      .attr('fill', 'url(#legend-gradient)');

    legend
      .append('text')
      .attr('x', 0)
      .attr('y', 30)
      .attr('font-size', '10px')
      .text(`Low: $${(d3.min(data, (d) => d.sellingPrice) as number).toFixed(2)}`);

    legend
      .append('text')
      .attr('x', 80)
      .attr('y', 30)
      .attr('font-size', '10px')
      .attr('text-anchor', 'end')
      .text(`High: $${(d3.max(data, (d) => d.sellingPrice) as number).toFixed(2)}`);
  } catch (error) {
    console.error('Error loading or rendering chart:', error);
  }
}
