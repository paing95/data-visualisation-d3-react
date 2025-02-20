import { useState } from "react";

/* d3 */
import { 
    format,
    max,
    scaleBand, 
    scaleLinear
} from "d3";

/* data retrieval */
import { useData } from "./useData";

/* components */
import { AxisBottom } from "./components/AxisBottom";
import { AxisLeft } from "./components/AxisLeft";
import { Marks } from "./components/Marks";
import { ToolTip } from "./components/ToolTip";

/* css */
import './PopulationChart.css';

export const PopulationChart = ({ width=window.innerWidth, height=window.innerHeight }) => {

    /* React State to point current hover bar */
    // const [hoveredBar, setHoveredBar] = useState(null);
    
    // Retrieving data from the github gist is separated as a Custom Hook
    const data = useData();

    if (!data) {
        return <pre>Loading...</pre>
    }

    /* Constants */
    // Margin Top, Right, Bottom, and Left of the chart
    const margin = {
        top: 20,
        right: 50,
        bottom: 100, 
        left: 220
    }
    const xAxisOffsetValue = 70;
    const tooltipLeftOffset = 225;
    const tooltipTopOffset = 50;

    // To show the population in Million, Billion e.g. 400M, 1.2B
    const siFormat = format('.2s');
    const xAxisTickFOrmat = tickValue => siFormat(tickValue).replace('G', 'B');

    const innerHeight = height - margin.top - margin.bottom;
    const innerWidth = width - margin.left - margin.right;
    console.log('Population Chart Data:', data);
    const xValue = d => d.Population;
    const xScale = scaleLinear() // Ideal for measurement
        .domain([0, max(data, xValue)]) // Zero to Max of Population value
        .range([0, innerWidth]) // Length of X axis
    
    const yValue = d => d.Country;
    const yScale = scaleBand() // Ideal for ordinal or categorical dimension
        .domain(data.map(yValue)) // To point which value to use as Y axis
        .range([0, innerHeight]) // Length of Y axis
        .paddingInner(0.2) // Padding between each bar

    return (
        <div className="population-chart">
            <svg width={width} height={height} className="population-bar-chart">
                <g transform={`translate(${margin.left},${margin.top})`}>
                    <AxisBottom 
                        xScale={xScale}
                        innerHeight={innerHeight}
                        tickFormat={xAxisTickFOrmat}
                    />
                    <AxisLeft
                        yScale={yScale}
                    />
                    <text
                        className="axis-label"
                        x={innerWidth / 2}
                        y={innerHeight + xAxisOffsetValue}
                        textAnchor="middle"
                    >Population</text>
                    <Marks
                        data={data}
                        xScale={xScale}
                        yScale={yScale}
                        xValue={xValue}
                        yValue={yValue}
                        tooltipFormat={xAxisTickFOrmat}
                    />
                </g>
            </svg>
            {/* {hoveredBar ? (
                <ToolTip 
                    title={xAxisTickFOrmat(xValue(hoveredBar))}
                    left={xScale(xValue(hoveredBar)) + tooltipLeftOffset}
                    top={yScale(yValue(hoveredBar)) + tooltipTopOffset}
                />
            ) : null} */}
        </div>
    )
}

