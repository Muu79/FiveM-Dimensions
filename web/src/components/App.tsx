import React, { useEffect, useState } from 'react';
import './App.css'
import { debugData } from "../utils/debugData";
import { fetchNui } from "../utils/fetchNui";
import Menu from './Menu/Menu';

// This will set the NUI to visible if we are
// developing in browser
debugData([
  {
    action: 'setVisible',
    data: true,
  }
])

interface ReturnClientDataCompProps {
  data: any
}

const ReturnClientDataComp: React.FC<ReturnClientDataCompProps> = ({ data }) => (
  <>
    <h5>Returned Data:</h5>
    <pre>
      <code>
        {JSON.stringify(data, null)}
      </code>
    </pre>
  </>
)


const App: React.FC = () => {
  const [menuItems, setMenuItems] = useState<{name:string}[]>([{name:'item1'}, {name: 'item2'}]);
  useEffect(()=>{
    fetchNui('getMenuOptions').then(res => {
      console.log(res);
      setMenuItems(res);
    }).catch(e => {
      console.error(e)
    })
  })
  return (
    <div>
      <Menu items={menuItems}/>
    </div>
  );
}

export default App;
