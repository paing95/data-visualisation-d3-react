import { useState, useEffect } from "react";
import { json } from "d3";
import { feature, mesh } from 'topojson-client';

const url = 'https://unpkg.com/world-atlas@2.0.2/countries-50m.json';

export const useWorld = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        json(url).then(topology => {
            const { countries, land } = topology.objects;
            setData({
                countries: feature(topology, countries),
                interiors: mesh(
                    topology, countries, (a, b) => a !== b
                )
            });
        });
    }, []);

    return data;
}