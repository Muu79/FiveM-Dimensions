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


const App: React.FC = () => {
  const [menuItems, setMenuItems] = useState<{name:string}[]>([{name:'item1'}, {name: 'item2'}]);
  useEffect(()=>{
    fetchNui('getMenuOptions').then(res => {
      setMenuItems(res);
    }).catch(e => {
      setMenuItems([{name: 'item1'}, {name: 'item2'}, {name:'item3'}])
      console.error(e)
    })
  }, [])
  return (
    <div>
      <Menu items={menuItems}/>
    </div>
  );
}

export default App;
