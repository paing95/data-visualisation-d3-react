import { useState } from "react";

/* d3 */
import { extent, format, scaleLinear, scaleTime, timeFormat } from "d3";

/* data retrieval */
import { useData } from "./useData";

/* components */
import { AxisBottom } from "./components/AxisBottom";
import { AxisLeft } from "./components/AxisLeft";
import { Marks } from "./components/Marks";

/* css */
import "./TemperatureLineChart.css";

export const TemperatureLineChart = ({
  width = window.innerWidth,
  height = window.innerHeight,
}) => {
  // Retrieving data from the github gist is separated as a Custom Hook
  const data = useData();

  if (!data) {
    return <pre>Loading...</pre>;
  }

  /* Constants */
  // Margin Top, Right, Bottom, and Left of the chart
  const margin = {
    top: 20,
    right: 50,
    bottom: 100,
    left: 120,
  };
  const xAxisOffsetValue = 70;
  const yAxisLabelOffset = 60;

  const xAxisTickFOrmat = timeFormat("%a");

  const innerHeight = height - margin.top - margin.bottom;
  const innerWidth = width - margin.left - margin.right;

  const xValue = (d) => d.timestamp;
  const xAxisLabel = "Time";

  const yValue = (d) => d.temperature;
  const yAxisLabel = "Temperature";

  const xScale = scaleTime() // Ideal for measurement
    .domain(extent(data, xValue)) // d3 extent gives min and max of given data
    .range([0, innerWidth]) // Length of X axis
    .nice();

  const yScale = scaleLinear() // Ideal for measurement
    .domain(extent(data, yValue)) // d3 extent gives min and max of given data
    .range([innerHeight, 0]) // Length of Y axis
    .nice();

  return (
    <div className="temperature-line-chart">
      <svg viewBox={`0 0 ${width} ${height}`} className="population-bar-chart">
        <g transform={`translate(${margin.left},${margin.top})`}>
          <AxisBottom
            xScale={xScale}
            innerHeight={innerHeight}
            tickFormat={xAxisTickFOrmat}
            tickOffset={5}
          />
          <text
            className="axis-label"
            textAnchor="middle"
            transform={`translate(${-yAxisLabelOffset}, ${
              innerHeight / 2
            }) rotate(-90)`}
          >
            {yAxisLabel}
          </text>
          <AxisLeft yScale={yScale} innerWidth={innerWidth} tickOffset={10} />
          <text
            className="axis-label"
            x={innerWidth / 2}
            y={innerHeight + xAxisOffsetValue}
            textAnchor="middle"
          >
            {xAxisLabel}
          </text>
          <Marks
            data={data}
            xScale={xScale}
            yScale={yScale}
            xValue={xValue}
            yValue={yValue}
            tooltipFormat={xAxisTickFOrmat}
            circleRadius={3}
          />
        </g>
      </svg>
    </div>
  );
};
