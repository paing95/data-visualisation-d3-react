import { useMemo } from "react";

/* d3 */
import { scaleSqrt, max } from "d3";

import { Marks } from "./Marks";

const sizeValue = d => d['Total Dead and Missing'];
const maxRadius = 15;

export const BubbleMap = ({ world, originalMigrationData, migrationData }) => {
    
    const sizeScale = useMemo(() => scaleSqrt()
        .domain([0, max(originalMigrationData, sizeValue)])
        .range([0, maxRadius]), [originalMigrationData, sizeValue, maxRadius]);

    return (
        <Marks
            world={world}
            migrationData={migrationData}
            sizeScale={sizeScale}
            sizeValue={sizeValue}
        />
    )
}