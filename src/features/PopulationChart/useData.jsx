import { useState, useEffect } from "react";
import { csv } from "d3";

const url = 'https://gist.githubusercontent.com/' +
'curran/0ac4077c7fc6390f5dd33bf5c06cb5ff/raw/' + 
'605c54080c7a93a417a3cea93fd52e7550e76500/UN_Population_2019.csv';

export const useData = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const updateRow = row => {
            row.Population = +row['2020'] * 1000;
            return row;
        }
        csv(url, updateRow).then(data => {
            setData(data.slice(0, 10));
        })
    }, []);

    return data;
}