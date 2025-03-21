export const ColorLegend = ({ 
    colorScale, tickSpacing=20, 
    tickSize=10, tickTextOffset=20,
    onHover, hoveredValue, fadeOpacity
 }) => 
    colorScale.domain().map((domainValue, i) => (
        <g 
            className="tick" 
            transform={`translate(0, ${i * tickSpacing})`}
            onMouseEnter={() => onHover(domainValue)}
            onMouseOut={() => onHover(null)}
            opacity={hoveredValue && domainValue !== hoveredValue ? fadeOpacity : 1.0}
        >
            <circle 
                fill={colorScale(domainValue)} 
                r={tickSize}
            />
            <text dy=".32em" x={tickTextOffset}>{domainValue}</text>
        </g>
    ));