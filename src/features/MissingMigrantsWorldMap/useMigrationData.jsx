import { useState, useEffect } from "react";
import { csv } from "d3";

const url = 'https://gist.githubusercontent.com/' + 
'curran/a9656d711a8ad31d812b8f9963ac441c/raw/' + 
'267eac8b97d161c479d950ffad3ddd5ce2d1f370/MissingMigrants-Global-2019-10-08T09-47-14-subset.csv';

export const useMigrationData = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const updateRow = row => {
            row['Total Dead and Missing'] = +row['Total Dead and Missing'];
            row['Reported Date'] = new Date(row['Reported Date']);
            row.coords = row['Location Coordinates']
                .split(', ')
                .map(d => +d)
                .reverse()
            return row;
        }
        csv(url, updateRow).then(setData);
    }, []);

    return data;
}