export const Marks = ({ 
    binnedData, 
    xScale,
    yScale,
    innerHeight
}) => {
    return binnedData.map(d => <rect 
        className="mark"
        x={xScale(d.x0)}
        y={yScale(d.y)}
        width={xScale(d.x1) - xScale(d.x0)}
        height={innerHeight - yScale(d.y)}
    >
        <text>{d => d}</text>
    </rect>
    )
}