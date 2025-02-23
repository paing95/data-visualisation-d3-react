export const Marks = ({ 
    data, 
    xScale, xValue, 
    yScale, yValue, 
    colorScale, colorValue,
    tooltipFormat, circleRadius }) => {
    return data.map(d => <circle 
        className="mark"
        cx={xScale(xValue(d))}
        cy={yScale(yValue(d))}
        fill={colorScale(colorValue(d))}
        r={circleRadius}
    >
        <text>{tooltipFormat(xValue(d))}</text>
    </circle>
    )
}