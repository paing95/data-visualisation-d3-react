import { useState, useEffect } from "react";
import { csv } from "d3";

const url = 'https://gist.githubusercontent.com/' + 
'curran/a08a1080b88344b0c8a7/raw/' + 
'639388c2cbc2120a14dcf466e85730eb8be498bb/iris.csv';

export const useData = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const updateRow = row => {
            row.sepal_length = +row.sepal_length
            row.sepal_width = +row.sepal_width
            row.petal_length = +row.petal_length
            row.petal_width = +row.petal_width
            return row;
        }
        csv(url, updateRow).then(setData);
    }, []);

    return data;
}