import './App.css'
import { debugData } from "../utils/debugData";
import Menu from './Menu/Menu';

// This will set the NUI to visible if we are
// developing in browser
debugData([
  {
    action: 'setVisible',
    data: true,
  }
])


const App: React.FC = () => {
  return (
    <div>
      <Menu/>
    </div>
  );
}

export default App;
