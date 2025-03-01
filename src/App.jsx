import { useState } from 'react';

/* components */
import { IrisScatterPlot } from './features/IrisScatterPlot/IrisScatterPlot';
import { PopulationChart } from './features/PopulationChart/PopulationChart';
import { TemperatureLineChart } from './features/TemperatureLineChart/TemperatureLineChart';
import { WorldMap } from './features/WorldMap/WorldMap';
import { MissingMigrantsChart } from './features/MissingMigrantsChart/MissingMigrantsChart';
import { MissingMigrantsWorldMap } from './features/MissingMigrantsWorldMap/MissingMigrantsWorldMap';
import { HIVChoroplethMap } from './features/HIVChoroplethMap/HIVChoroplethMap';

/* boostrap */
import { ListGroup } from 'react-bootstrap';

/* css */
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const width = 1000;
const height = 700;

const App = () => {

  // state
  const [selectedChart, setSelectedChart] = useState("Population Chart");

  const typesOfCharts = {
    "Population Chart": <PopulationChart width={width} height={height} />,
    "Iris Scatter Plot": <IrisScatterPlot width={width} height={height} />,
    "Temperature Chart": <TemperatureLineChart width={width} height={height} />,
    "World Map": <WorldMap width={width} height={height} />,
    "Missing Migrants": <MissingMigrantsChart width={width} height={height} />,
    "Missing Migrants World Map": <MissingMigrantsWorldMap width={width} height={height} />,
    "HIV Choropleth Map": <HIVChoroplethMap width={width} height={height} />
  };

  return <div className='row content'>
    <div className='col-3 menu'>
      <h3 className='title mt-4 mb-4'>Type of Charts</h3>
      <ListGroup>
        {Object.keys(typesOfCharts).map(
          key => <ListGroup.Item 
            className={selectedChart === key && "active"}
            onClick={() => setSelectedChart(key)}
            key={key}
          >{key}</ListGroup.Item>
        )}
      </ListGroup>
    </div>
    <div className='col-9 charts-content pt-4'>
      <h1 className='title mb-5'>{selectedChart}</h1>
      {selectedChart && typesOfCharts[selectedChart]}
    </div>
  </div>
}


export default App;
