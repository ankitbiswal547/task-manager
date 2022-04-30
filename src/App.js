import React, { useEffect, useState } from 'react';
import './App.css';
import info from './data';

import DragNDrop from './components/DragNDrop'

const defaultData = info

function App() {
  const [data, setData] = useState();
  useEffect(() => {
    const arr = JSON.parse(localStorage.getItem("List") || "[]");
    if (arr.length === 0) {
      localStorage.setItem("List", JSON.stringify(defaultData));
    }
    setData(JSON.parse(localStorage.getItem("List") || "[]"));
  }, [setData])


  const formSubmitHandler = (task, id) => {
    const arr = JSON.parse(localStorage.getItem("List") || "[]");
    arr[id].items.push(task);
    localStorage.setItem("List", JSON.stringify(arr));
    setData(arr);
  }



  return (
    <div className="App">
      <DragNDrop onFormSubmit={formSubmitHandler} data={data} />
    </div>
  );
}

export default App;
