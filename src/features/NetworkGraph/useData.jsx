import { useState, useEffect } from "react";
import { json } from "d3";

const url =
  "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_network.json";

export const useData = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    json(url).then((d) => {
      d.nodes.forEach((n) => {
        n.desc = `Desc - ${n.name}`;
      });
      setData(d);
    });
  }, []);

  return data;
};
