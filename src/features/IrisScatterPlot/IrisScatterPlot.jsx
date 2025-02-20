import { useState } from "react";
import ReactSelect from 'react-select';

/* d3 */
import { 
    extent,
    format,
    scaleLinear,
    scaleOrdinal
} from "d3";

/* data retrieval */
import { useData } from "./useData";

/* components */
import { AxisBottom } from "./components/AxisBottom";
import { AxisLeft } from "./components/AxisLeft";
import { ColorLegend } from "./components/ColorLegend";
import { Dropdown } from "./components/Dropdown";
import { Marks } from "./components/Marks";

/* css */
import './IrisScatterPlot.css';

const attributes = [
    { value: 'sepal_length', label: 'Sepal Length' },
    { value: 'sepal_width', label: 'Sepal Width' },
    { value: 'petal_length', label: 'Petal Length' },
    { value: 'petal_width', label: 'Petal Width' },
    { value: 'species', label: 'Species '}
]

const getLabel = value => {
    for (let i = 0; i < attributes.length; i++) {
        if (attributes[i].value === value) {
            return attributes[i].label;
        }
    }
}

/* Constants */
// Margin Top, Right, Bottom, and Left of the chart
const margin = {
    top: 30,
    right: 200,
    bottom: 100, 
    left: 120
}
const xAxisOffsetValue = 70;
const yAxisLabelOffset = 70;
const circleRadius = 7;
const fadeOpacity = 0.2;

export const IrisScatterPlot = ({ width=window.innerWidth, height=window.innerHeight }) => {

    // Retrieving data from the github gist is separated as a Custom Hook
    const data = useData();

    // useState
    const initialXAttribute = 'petal_length';
    const [xAttribute, setXAttribute] = useState(initialXAttribute);
    
    const initialYAttribute = 'sepal_width';
    const [yAttribute, setYAttribute] = useState(initialYAttribute);

    const [hoveredValue, setHoveredValue] = useState(null);

    if (!data) {
        return <pre>Loading...</pre>
    }
    
    // X-Axis
    const xValue = d => d[xAttribute];
    const xAxisLabel = getLabel(xAttribute);

    const siFormat = format('.2s');
    const xAxisTickFormat = tickValue => siFormat(tickValue).replace('G', 'B');

    // Y-Axis
    const yValue = d => d[yAttribute];
    const yAxisLabel = getLabel(yAttribute);

    // Color
    const colorValue = d => d.species;
    const colorLegendLabel = "Species";

    const filteredData = data.filter(d => hoveredValue === colorValue(d));

    // Calculations
    const innerHeight = height - margin.top - margin.bottom;
    const innerWidth = width - margin.left - margin.right;
    
    const xScale = scaleLinear() // Ideal for measurement
        .domain(extent(data, xValue)) // d3 extent gives min and max of given data
        .range([0, innerWidth]) // Length of X axis
        .nice();
    
    const yScale = scaleLinear() // Ideal for measurement
        .domain(extent(data, yValue)) // d3 extent gives min and max of given data
        .range([0, innerHeight]); // Length of Y axis
    
    const colorScale = scaleOrdinal()
        .domain(data.map(colorValue))
        .range(['#E6842A', '#137B80', '#8E6C8A']);
    

    return <div className="iris-scatter-plot">
        <div className="dropdown-wrapper-parent">
            {/* X Axis Dropdown */}
            <div className="dropdown-wrapper">
                <label className="dropdown-label" for="x-select">X:</label>
                <ReactSelect 
                    options={attributes}
                    id={"x-select"}
                    onChange={e => setXAttribute(e.value)}
                    className="dropdown"
                    value={xAttribute}
                    styles={{
                        control: (baseStyles, state) => ({
                            ...baseStyles,
                            backgroundColor: 'white',
                            color: 'black'
                        }),
                        option: (baseStyles, state) => ({
                            ...baseStyles,
                            backgroundColor: state.isFocused ? '#688BAB' : 'white',
                            color: state.isFocused ? 'white' : 'black'
                        }),
                    }}
                />
            </div>
            {/* Y Axis Dropdown */}
            <div className="dropdown-wrapper">
                <label className="dropdown-label" for="y-select">Y:</label>
                <ReactSelect 
                    options={attributes}
                    id={"y-select"}
                    onChange={e => setYAttribute(e.value)}
                    value={yAttribute}
                    className="dropdown"
                    styles={{
                        control: (baseStyles, state) => ({
                            ...baseStyles,
                            backgroundColor: 'white',
                            color: 'black'
                        }),
                        option: (baseStyles, state) => ({
                            ...baseStyles,
                            backgroundColor: state.isFocused ? '#688BAB' : 'white',
                            color: state.isFocused ? 'white' : 'black'
                        }),
                    }}
                />
            </div>
        </div>
        {/* Graph */}
        <svg width={width} height={height} className="population-bar-chart">
            <g transform={`translate(${margin.left},${margin.top})`}>
                {/* X-Axis */}
                <AxisBottom 
                    xScale={xScale}
                    innerHeight={innerHeight}
                    tickFormat={xAxisTickFormat}
                    tickOffset={5}
                />
                <text
                    className="axis-label"
                    x={innerWidth / 2}
                    y={innerHeight + xAxisOffsetValue}
                    textAnchor="middle"
                >{xAxisLabel}</text>
                
                {/* Y-Axis */}
                <AxisLeft
                    yScale={yScale}
                    innerWidth={innerWidth}
                    tickOffset={5}
                />
                <text
                    className="axis-label"
                    textAnchor="middle"
                    transform={`translate(${-yAxisLabelOffset}, ${innerHeight / 2}) rotate(-90)`}
                >{yAxisLabel}</text>

                <g transform={`translate(${innerWidth + 40}, ${innerHeight - 420})`}>
                    <text
                        x={35}
                        y={-25}
                        className="axis-label"
                        textAnchor="middle"
                    >{colorLegendLabel}</text>
                    <ColorLegend 
                        colorScale={colorScale}
                        tickSpacing={22}
                        tickSize={circleRadius}
                        tickTextOffset={15}
                        circleRadius={circleRadius}
                        onHover={setHoveredValue}
                        hoveredValue={hoveredValue}
                        fadeOpacity={fadeOpacity}
                    />
                </g>

                {/* Plots */}
                <g opacity={hoveredValue ? fadeOpacity : 1.0}>
                    <Marks
                        data={data}
                        xScale={xScale}
                        xValue={xValue}
                        yScale={yScale}
                        yValue={yValue}
                        colorScale={colorScale}
                        colorValue={colorValue}
                        tooltipFormat={xAxisTickFormat}
                        circleRadius={circleRadius}
                    />
                </g>
                <Marks
                    data={filteredData}
                    xScale={xScale}
                    xValue={xValue}
                    yScale={yScale}
                    yValue={yValue}
                    colorScale={colorScale}
                    colorValue={colorValue}
                    tooltipFormat={xAxisTickFormat}
                    circleRadius={circleRadius}
                />
            </g>
        </svg>
    </div>
}