import React, { useState, useEffect } from 'react';
import socketIOClient from "socket.io-client";
import Chart from "react-google-charts";
import './App.css';
import LightWeightChart from './LightWeightChart';
import Exchange from './Exchange'
import Stock from './Stock'



const PROTOCOL = 'wss://';
const SERVER = 'le-18262636.bitzonte.com';
const PATH = '/stocks';


function App() {
  const [socket, setSocket] = useState(null);
  const [buttonText, setButtonText] = useState("Desconectarse")
  const [stocksValues, setStocksValues] = useState({})  // Key: Stock name, Value: List of values
  const [maxValues, setMaxValues] = useState({})
  const [minValues, setMinValues] = useState({})
  const [initialTime, setInitialTime] = useState(Date.now())
  const [exchanges, setExchanges] = useState({})
  const [parser, setParser] = useState({})

  const [buyVolumes, setBuyVolumes] = useState({})
  const [sellVolumes, setSellVolumes] = useState({})

  //const [data, setData] = useState([['x', 'dogs']])
  const [data, setData] = useState([])

  useEffect(() => {
    const sock = socketIOClient(PROTOCOL + SERVER, {
      path: PATH
    })
    setSocket(sock);
    sock.emit('EXCHANGES')
    sock.on('EXCHANGES', (data) => {
      console.log(data)
      setExchanges(data)
    })
    sock.emit('STOCKS')
    sock.on('STOCKS', data => {
      console.log(data)
      for (var i = 0; i < data.length; i++) {
        const name = data[i].company_name
        setParser(crr => ({...crr, [name]: data[i].ticker}))
      }
    })

    sock.on('UPDATE', res => {
      helperMaxValues(res);
      helperMinValues(res);
      setStocksValues(currentData => {
        if (res.ticker in currentData) {
          return {
            ...currentData,
            [res.ticker]: [...currentData[res.ticker], {time: timeInSecs(res.time), value: res.value}]  
          }
        }
        else {
          return {
            ...currentData,
            [res.ticker]: [{time: timeInSecs(res.time), value: res.value}]  
          }
        }
      })
      //setData(currentData => [...currentData, [res.time, res.value]])
      setData(currentData => [...currentData, {time: timeInSecs(res.time), value: res.value}])
    })

    sock.on('BUY', res => {
      setBuyVolumes(currentData => {
        if (res.ticker in currentData) {
          return {
            ...currentData,
            [res.ticker]: currentData[res.ticker] + res.volume
          }
        } else {
          return {
            ...currentData,
            [res.ticker]: res.volume
          }
        }
      })
    })

    sock.on('SELL', res => {
      setSellVolumes(currentData => {
        if (res.ticker in currentData) {
          return {
            ...currentData,
            [res.ticker]: currentData[res.ticker] + res.volume
          }
        } else {
          return {
            ...currentData,
            [res.ticker]: res.volume
          }
        }
      })
    })

  }, [])

  const helperMaxValues = (res) => {
    setMaxValues(currentData => {
      if (!(res.ticker in currentData) || currentData[res.ticker] < res.value) {
        return { ...currentData, [res.ticker]: res.value}  
      } else {
        return { ...currentData }
      }
    })
  }

  const helperMinValues = (res) => {
    setMinValues(currentData => {
      if (!(res.ticker in currentData) || currentData[res.ticker] > res.value) {
        return { ...currentData, [res.ticker]: res.value}  
      } else {
        return { ...currentData }
      }
    })
  }

  const changeState = () => {
    console.log(buyVolumes)
    console.log(sellVolumes)

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
    <div className="wrapper">
      <div className="container-button">
        {socket ? 
          <button className="button1" onClick={changeState}>
              {buttonText}
          </button>

        : null}
      </div>
      <div className="row">
        <div className="container-stocks">
          {Object.keys(exchanges).map(exchange => (
            exchanges[exchange].listed_companies.map(company => {
              const stock = parser[company]
              if (stock in stocksValues) {
                return (
                  <div className="container-stock border" key={stock}>
                    <LightWeightChart stock={stock} data={stocksValues[stock]}/>
                    <Stock
                      stock={stock}
                      maxValues={maxValues}
                      minValues={minValues}
                      stocksValues={stocksValues}
                      buyVolumes={buyVolumes}
                      sellVolumes={sellVolumes}
                    />
                  </div>
                )
              } else return null
            })
            
          ))        
          }
        </div>
        <div className="container-exchanges">
          {Object.keys(exchanges).map(exchange => (
            <Exchange 
              exchange={exchange}
              infoExchange={exchanges[exchange]}
              buyVolumes={buyVolumes}
              parser={parser}
              sellVolumes={sellVolumes}
              key={exchange}
            />
          ))}
        </div>
      </div>
      <div className="container1">
        <div className="div1">hola</div>
        <div className="div1">chao</div>
      </div>

    </div>
  );
}

const timeInSecs = (time) => {
  return Math.round(time / 1000) - 4 * 60 * 60
}


export default App;
