import { useMemo } from "react";
import { geoEqualEarth, geoNaturalEarth1, geoPath, geoGraticule } from "d3";

const projection = geoNaturalEarth1();
const path = geoPath(projection);
const graticule = geoGraticule();

export const Marks = ({ world: { land, interiors }, migrationData, sizeScale, sizeValue }) => {
    return <g className="marks">
        {useMemo(() => <>
            <path 
                className="sphere"
                d={path({ type: 'Sphere' })}
            />
            <path 
                className="graticules"
                d={path(graticule())} 
            />
            {land.features.map(feature => <path 
                    className="land"
                    d={path(feature)} 
                /> 
            )}
            <path 
                className="interiors"
                d={path(interiors)} 
            />
        </>, [path, graticule, land, interiors])}
        {migrationData.map(d => {
            const [x, y] = projection(d.coords);
            return <circle cx={x} cy={y} r={sizeScale(sizeValue(d))} />
        })}
    </g>
}