export const Marks = ({ data, xScale, yScale, xValue, yValue, tooltipFormat }) => {
    return data.map(d => <rect 
        className="mark"
        key={yValue(d)}
        x={0}
        y={yScale(yValue(d))}
        width={xScale(xValue(d))}
        height={yScale.bandwidth()}
    >
        <text fill="black">{tooltipFormat(xValue(d))}</text>
    </rect>    
    )
}