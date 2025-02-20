import { line, curveNatural } from "d3-shape";

export const Marks = ({ data, xScale, yScale, xValue, yValue, tooltipFormat, circleRadius }) => {
    return <g className="marks">
        <path 
            d={
                line()
                    .x(d => xScale(xValue(d)))
                    .y(d => yScale(yValue(d)))
                    .curve(curveNatural)(data)
            } 
        />
        {
            data.map(d => <circle 
                cx={xScale(xValue(d))}
                cy={yScale(yValue(d))}
                r={circleRadius}
            >
                <text>{tooltipFormat(xValue(d))}</text>
            </circle>    
            )
        }
    </g>
}