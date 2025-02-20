import { useState, useEffect } from "react";
import { csv } from "d3";

const url = 'https://gist.githubusercontent.com/' + 
'curran/90240a6d88bdb1411467b21ea0769029/raw/' + 
'7d4c3914cc6a29a7f5165f7d5d82b735d97bcfe4/week_temperature_sf.csv';

export const useData = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const updateRow = row => {
            row.temperature = +row.temperature;
            row.timestamp = new Date(row.timestamp);
            return row;
        }
        csv(url, updateRow).then(setData);
    }, []);

    return data;
}