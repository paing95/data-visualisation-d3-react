/* d3 */
import {
  bin,
  extent,
  format,
  max,
  scaleLinear,
  scaleTime,
  sum,
  timeFormat,
  timeMonths,
} from "d3";

/* data retrieval */
import { useData } from "./useData";

/* components */
import { AxisBottom } from "./components/AxisBottom";
import { AxisLeft } from "./components/AxisLeft";
import { Marks } from "./components/Marks";

/* css */
import "./MissingMigrantsChart.css";

export const MissingMigrantsChart = ({
  width = window.innerWidth,
  height = window.innerHeight,
}) => {
  // Retrieving data from the github gist is separated as a Custom Hook
  const data = useData();

  if (!data) {
    return <pre>Loading...</pre>;
  }
  /*
        "data" is an array of the following.
        [{ 
            Location Coordinates: "35.210549549164, 12.180541076066"
            Reported Date:  Mon Oct 07 2019 00:00:00 GMT-0600 (Central Standard Time) {}
            Total Dead and Missing: 28
        }]
    */

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

  const xAxisTickFormat = timeFormat("%m/%d/%Y");

  const innerHeight = height - margin.top - margin.bottom;
  const innerWidth = width - margin.left - margin.right;

  // accessor function to an object
  const xValue = (d) => d["Reported Date"];
  const xAxisLabel = "Reported Date";

  // accessor function to an object
  const yValue = (d) => d["Total Dead and Missing"];
  const yAxisLabel = "Total Dead and Missing";

  const xScale = scaleTime()
    // "domain" represents the set of input values to the scale
    .domain(extent(data, xValue)) // "extent" returns min, max of value
    // "range" represents the set of output values that the scale will map to
    // screen positiions
    .range([0, innerWidth]) // set the scale range
    .nice();

  const [start, stop] = xScale.domain();

  // "bin" groups data points into buckets
  const binnedData = bin()
    .value(xValue)
    .domain(xScale.domain())
    // "threshold" scale divides the domain into distinct ranges (or "bins") based on a set of threshold values
    .thresholds(timeMonths(start, stop))(data)
    .map((array) => ({
      y: sum(array, yValue),
      x0: array.x0,
      x1: array.x1,
    }));

  /*
        "binnedData" is an array of the following.
        [
            {
                x0: Wed Jan 01 2014 00:00:00 GMT-0600 (Central Standard Time) {}
                x1: Sat Feb 01 2014 00:00:00 GMT-0600 (Central Standard Time) {}
                y: 27
            }
        ]
    */

  const yScale = scaleLinear()
    .domain([0, max(binnedData, (d) => d.y)])
    .range([innerHeight, 0])
    .nice();

  return (
    <div className="missing-migrants-chart">
      <svg viewBox={`0 0 ${width} ${height}`}>
        <g transform={`translate(${margin.left},${margin.top})`}>
          <AxisBottom
            xScale={xScale}
            innerHeight={innerHeight}
            tickFormat={xAxisTickFormat}
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
            binnedData={binnedData}
            xScale={xScale}
            yScale={yScale}
            innerHeight={innerHeight}
          />
        </g>
      </svg>
    </div>
  );
};
