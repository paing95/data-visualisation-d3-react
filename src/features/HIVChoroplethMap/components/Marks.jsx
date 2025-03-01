import { geoEqualEarth, geoNaturalEarth1, geoPath, geoGraticule } from "d3";

const projection = geoNaturalEarth1();
const path = geoPath(projection);
const graticule = geoGraticule();

const missingDataColor = 'gray';

export const Marks = ({ world: { countries, interiors }, rowByNumericCode, colorScale, colorValue }) => {
    return <g className="marks">
        <path 
            className="sphere"
            d={path({ type: 'Sphere' })}
        />
        <path 
            className="graticules"
            d={path(graticule())} 
        />
        {countries.features.map(feature => {
            const d = rowByNumericCode.get(feature.id);
            return (
                <path 
                    fill={d ? colorScale(colorValue(d)) : missingDataColor}
                    d={path(feature)} 
                /> 
            )}
        )}
        <path 
            className="interiors"
            d={path(interiors)} 
        />
    </g>
}