import { useState } from "react";

/* d3 */
// import { } from "d3";

/* data retrieval */
import { useData } from "./useData";

/* components */
import { Marks } from "./components/Marks";

/* css */
import './WorldMap.css';

export const WorldMap = ({ width=window.innerWidth, height=window.innerHeight }) => {

    // Retrieving data from the github gist is separated as a Custom Hook
    const data = useData();

    if (!data) {
        return <pre>Loading...</pre>
    }
    

    return <div className="world-map">
        <svg width={width} height={height} className="population-bar-chart">
            <Marks
                data={data}
            />
        </svg>
    </div>
}