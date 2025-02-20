/* components */
import { IrisScatterPlot } from './features/IrisScatterPlot/IrisScatterPlot';
import { PopulationChart } from './features/PopulationChart/PopulationChart';
import { TemperatureLineChart } from './features/TemperatureLineChart/TemperatureLineChart';
import { WorldMap } from './features/WorldMap/WorldMap';

/* css */
import './App.css';

const width = 1000;
const height = 600;

const App = () => {
  return <div className='container'>

    <h1 className='title'>Bar Chart</h1>
    <PopulationChart
      width={width}
      height={height}
    />
    
    <h1 className='title'>Scatter Plot</h1>
    <IrisScatterPlot 
      width={width}
      height={height}
    />

    <h1 className='title'>Line Chart</h1>
    <TemperatureLineChart 
      width={width}
      height={height}
    />

    <h1 className='title'>World Map</h1>
    <WorldMap 
      width={width}
      height={height}
    />
  </div>
}


export default App;
