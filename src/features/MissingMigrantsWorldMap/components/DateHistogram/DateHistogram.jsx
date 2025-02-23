import { useEffect, useRef, useMemo } from "react";

/* d3 */
import { 
    bin,
    brushX,
    extent,
    format,
    max,
    scaleLinear,
    scaleTime,
    select,
    sum,
    timeFormat,
    timeMonths
} from "d3";

/* components */
import { AxisBottom } from "./AxisBottom";
import { AxisLeft } from "./AxisLeft";
import { Marks } from "./Marks";

const margin = {
    top: 0,
    right: 30,
    bottom: 80, 
    left: 90
}
const xAxisOffsetValue = 40;
const yAxisLabelOffset = 50;
const xAxisTickFormat = timeFormat('%m/%d/%Y');

// accessor function to an object
const xAxisLabel = 'Reported Date';

// accessor function to an object
const yValue = d => d['Total Dead and Missing'];
const yAxisLabel = 'Total Dead and Missing';

export const DateHistogram = ({ width=window.innerWidth, height=window.innerHeight, data, setBrushExtent, xValue }) => {

    const brushRef = useRef();

    if (!data) {
        return <pre>Loading...</pre>
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
    const innerHeight = height - margin.top - margin.bottom;
    const innerWidth = width - margin.left - margin.right;
    
    const xScale = useMemo(() => scaleTime()
        // "domain" represents the set of input values to the scale
        .domain(extent(data, xValue)) // "extent" returns min, max of value
        // "range" represents the set of output values that the scale will map to
        // screen positiions
        .range([0, innerWidth]) // set the scale range
        .nice(), [data, xValue, innerWidth]);
    
    // "bin" groups data points into buckets
    const binnedData = useMemo(() => {
        const [start, stop] = xScale.domain();

        return bin()
            .value(xValue)
            .domain(xScale.domain())
            // "threshold" scale divides the domain into distinct ranges (or "bins") based on a set of threshold values
            .thresholds(timeMonths(start, stop))(data)
            .map(array => ({
                y: sum(array, yValue),
                x0: array.x0,
                x1: array.x1,
            }))
    }, [xValue, yValue, xScale, data]);
    
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
    
    const yScale = useMemo(() => scaleLinear()
        .domain([0, max(binnedData, d => d.y)])
        .range([innerHeight, 0])
        .nice(), [binnedData, innerHeight]);
    
    useEffect(() => {
        const brush = brushX()
            .extent([ [0,0], [innerWidth, innerHeight] ])
            .on('brush end', (event) => {
                // "invert" returns the corresponding value from the domain for a value from the range, 
                setBrushExtent(event.selection && event.selection.map(xScale.invert));
            });
        brush(select(brushRef.current));
    }, [innerWidth, innerHeight]);

    return ( 
        <>
            <rect width={width} height={height} fill="#fff" />
            <g 
                transform={`translate(${margin.left},${margin.top})`} 
                className="date-histogram"
            >
                <AxisBottom 
                    xScale={xScale}
                    innerHeight={innerHeight}
                    tickFormat={xAxisTickFormat}
                    tickOffset={5}
                />
                <text
                    className="axis-label"
                    textAnchor="middle"
                    transform={`translate(${-yAxisLabelOffset}, ${innerHeight / 2}) rotate(-90)`}
                >{yAxisLabel}</text>
                <AxisLeft
                    yScale={yScale}
                    innerWidth={innerWidth}
                    tickOffset={10}
                />
                <text
                    className="axis-label"
                    x={innerWidth / 2}
                    y={innerHeight + xAxisOffsetValue}
                    textAnchor="middle"
                >{xAxisLabel}</text>
                <Marks
                    binnedData={binnedData}
                    xScale={xScale}
                    yScale={yScale}
                    innerHeight={innerHeight}
                />
                <g ref={brushRef}></g>
            </g>
        </>
    )
}