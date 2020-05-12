import React, { useState, useEffect } from 'react';
import socketIOClient from "socket.io-client";
import './App.css';

const PROTOCOL = 'wss://';
const SERVER = 'le-18262636.bitzonte.com';
const PATH = '/stocks';


function App() {
  const [socket, setSocket] = useState(null);
  const [buttonText, setButtonText] = useState("Desconectarse")
  const [stocksValues, setStocksValues] = useState({})  // Key: Stock name, Value: List of values
  useEffect(() => {
    const sock = socketIOClient(PROTOCOL + SERVER, {
      path: PATH
    })
    setSocket(sock);
    sock.on('UPDATE', res => {
      if (res.ticker in stocksValues) {
        stocksValues[res.ticker].push(res.value)
      }
      else {
        stocksValues[res.ticker] = [res.value]
      }
      console.log(res)
    })

  }, [])

  const changeState = () => {
    console.log(stocksValues)
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
      Hello world
      {socket ? 
        <button onClick={changeState}>
            {buttonText}
        </button>
      : null}
    </div>
  );
}

export default App;
