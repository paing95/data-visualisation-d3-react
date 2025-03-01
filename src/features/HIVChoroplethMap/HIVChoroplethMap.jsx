/* d3 */
import { interpolateYlOrRd, scaleSequential, max } from "d3";

/* data retrieval */
import { useWorld } from "./useWorld";
import { useData } from "./useData";
import { useCodes } from "./useCodes";

/* components */
import { Marks } from "./components/Marks";

/* css */
import './HIVChoroplethMap.css';

const selectedYear = '2017';

export const HIVChoroplethMap = ({ width=window.innerWidth, height=window.innerHeight }) => {

    // Retrieving data from the github gist is separated as a Custom Hook
    const world = useWorld();
    const data = useData();
    const codes = useCodes();

    if (!world || !data || !codes) {
        return <pre>Loading...</pre>
    }

    const numericCodeByAlphaCode = new Map();
    codes.forEach(code => {
        const alpha3Code = code['alpha-3'];
        const numericCode = code['country-code'];
        numericCodeByAlphaCode.set(alpha3Code, numericCode);
    })

    const filteredData = data.filter(d => d['Year'] === selectedYear);
    const rowByNumericCode = new Map();
    filteredData.forEach(d => {
        const alpha3Code = d['Code'];
        const numericCode = numericCodeByAlphaCode.get(alpha3Code);
        rowByNumericCode.set(numericCode, d);
    });
    const colorValue = d => d.aids;
    
    const colorScale = scaleSequential(interpolateYlOrRd)
        .domain([0, max(data, colorValue)])

    return <div className="hiv-choropleth-map">
        <svg width={width} height={height}>
            <Marks
                world={world}
                rowByNumericCode={rowByNumericCode}
                colorScale={colorScale}
                colorValue={colorValue}
            />
        </svg>
    </div>
}