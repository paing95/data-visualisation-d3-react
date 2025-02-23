/* d3 */
import { scaleSqrt, max } from "d3";

/* data retrieval */
import { useData } from "./useData";
import { useCities } from "./useCities";

/* components */
import { Marks } from "./components/Marks";

/* css */
import './WorldMap.css';

export const WorldMap = ({ width=window.innerWidth, height=window.innerHeight }) => {

    // Retrieving data from the github gist is separated as a Custom Hook
    const world = useData();
    const cities = useCities();

    if (!world || !cities) {
        return <pre>Loading...</pre>
    }

    const sizeValue = d => d.population;
    const maxRadius = 15;
    
    const sizeScale = scaleSqrt()
        .domain([0, max(cities, sizeValue)])
        .range([0, maxRadius])

    return <div className="world-map">
        <svg width={width} height={height}>
            <Marks
                world={world}
                cities={cities}
                sizeScale={sizeScale}
                sizeValue={sizeValue}
            />
        </svg>
    </div>
}