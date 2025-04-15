import { useState } from "react";

/* data retrieval */
import { useData } from "./useData";
import { useMigrationData } from "./useMigrationData";

/* components */
import { BubbleMap } from "./components/BubbleMap/BubbleMap";
import { DateHistogram } from "./components/DateHistogram/DateHistogram";

/* css */
import "./MissingMigrantsWorldMap.css";

export const MissingMigrantsWorldMap = ({
  width = window.innerWidth,
  height = window.innerHeight,
}) => {
  // Retrieving data from the github gist is separated as a Custom Hook
  const world = useData();
  const migrationData = useMigrationData();
  const dateHistogramSize = 0.3;
  const [brushExtent, setBrushExtent] = useState();

  if (!world || !migrationData) {
    return <pre>Loading...</pre>;
  }

  const xValue = (d) => d["Reported Date"];
  const filteredMigrationData = brushExtent
    ? migrationData.filter((d) => {
        const date = xValue(d);
        return date > brushExtent[0] && date < brushExtent[1];
      })
    : migrationData;

  return (
    <div className="migration-world-map">
      <svg viewBox={`0 0 ${width} ${height}`}>
        <BubbleMap
          world={world}
          originalMigrationData={migrationData}
          migrationData={filteredMigrationData}
        />
        <g transform={`translate(0, ${height - height * dateHistogramSize})`}>
          <DateHistogram
            width={width - 50}
            height={height * dateHistogramSize}
            data={migrationData}
            setBrushExtent={setBrushExtent}
            xValue={xValue}
          />
        </g>
      </svg>
    </div>
  );
};
