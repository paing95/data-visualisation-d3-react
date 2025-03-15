import { useState, useEffect } from "react";
import { json } from "d3";

const url = 'https://gist.githubusercontent.com/paing95/038a49ddb559c278820ee854c7f7374e/raw/1a8e9a624fe07523f6abfa8997c20599cfce227b/sunburst_chart_sample.json';

export const useData = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        json(url).then(setData);
    }, []);

    return data;
}