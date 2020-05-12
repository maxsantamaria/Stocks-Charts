import React, { useState, useEffect } from 'react';
import socketIOClient from "socket.io-client";
import Chart from "react-google-charts";
import './App.css';
import LightWeightChart from './LightWeightChart';



const PROTOCOL = 'wss://';
const SERVER = 'le-18262636.bitzonte.com';
const PATH = '/stocks';


function App() {
  const [socket, setSocket] = useState(null);
  const [buttonText, setButtonText] = useState("Desconectarse")
  const [stocksValues, setStocksValues] = useState({})  // Key: Stock name, Value: List of values
  const [initialTime, setInitialTime] = useState(Date.now())

  //const [data, setData] = useState([['x', 'dogs']])
  const [data, setData] = useState([])

  useEffect(() => {
    const sock = socketIOClient(PROTOCOL + SERVER, {
      path: PATH
    })
    setSocket(sock);
    sock.on('UPDATE', res => {
      setStocksValues(currentData => {
        if (res.ticker in currentData) {
          return {
            ...currentData,
            [res.ticker]: [...currentData[res.ticker], [res.time - initialTime, res.value]]  
          }
        }
        else {
          return {
            ...currentData,
            [res.ticker]: [['x', 'Stock Value'], [res.time - initialTime, res.value]]  
          }
        }
      })
      //setData(currentData => [...currentData, [res.time, res.value]])
      setData(currentData => [...currentData, {time: timeInSecs(res.time), value: res.value}])
    })

  }, [])

  const changeState = () => {
    //setData([...data, [3, 100]])
    
    if (socket.connected) {
      socket.close()
      setButtonText('Conectarse')
    }
    else {
      socket.open()
      setButtonText('Desconectarse')
    }
  }

  return (
    <div className="App">
      <div>
        {socket ? 
          <button onClick={changeState}>
              {buttonText}
          </button>
        : null}
      </div>
      <div>
        {Object.keys(stocksValues).map(stock => (
          <LightWeightChart data={data}/>
        ))
        
        }
      </div>
      {/*Object.keys(stocksValues).map(stock => (
          
          <Chart
            width={'600px'}
            height={'400px'}
            chartType="LineChart"
            loader={<div>Loading Chart</div>}
            data={stocksValues[stock]}
            options={{
              hAxis: {
                title: 'Time',
              },
              vAxis: {
                title: 'Popularity',
              },
            }}
            rootProps={{ 'data-testid': '1' }}
          />
        ))*/}
    
      

    </div>
  );
}

const timeInSecs = (time) => {
  return Math.round(time / 1000) - 4 * 60 * 60
}

export default App;
