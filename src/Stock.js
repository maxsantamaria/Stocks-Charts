import React, { useState, useEffect } from 'react'

const Stock = ({ stock, maxValues, minValues, stocksValues, buyVolumes, sellVolumes }) => {
  const [totalVolume, setTotalVolume] = useState(0)
  useEffect(() => {
    let volume = 0
    if (stock in buyVolumes) {
      volume += buyVolumes[stock]
    }
    if (stock in sellVolumes) {
      volume += sellVolumes[stock]
    }
    setTotalVolume(volume)
  }, [buyVolumes, sellVolumes])
  return (
    <div className="stats">
      <div className="title">{stock}</div>
      <table className="table-stats">
        <tbody>
          <tr className="bottom-border">
            <td>Volumen total transado: </td>
            <td>{totalVolume}</td>
          </tr>
          <tr className="bottom-border">
            <td>Alto histórico:</td>
            <td>{maxValues[stock]}</td>
          </tr>
          <tr className="bottom-border">
            <td>Bajo histórico:</td>
            <td>{minValues[stock]}</td>
          </tr>
          <tr className="bottom-border">
            <td>Último precio:</td>
            <td>{getLastElem(stocksValues[stock]).value}</td>
          </tr>
          <tr>
            <td>Variación porcentual:</td>
            {variacionPorcentual(stocksValues[stock]) > 0 ? 
              <td style={{color: 'green'}}>{variacionPorcentual(stocksValues[stock]).toFixed(2)}%</td>
            :
              <td style={{color: 'red'}}>{variacionPorcentual(stocksValues[stock]).toFixed(2)}%</td>
            }
          </tr>
        </tbody>
      </table>
    </div>
  )
}

const getLastElem = (array) => {
  return array[array.length - 1]
}

const getSecondToLastElem = (array) => {
  return array[array.length - 2]
}

const variacionPorcentual = (array) => {
  if (array.length > 1) {
    const new_value = getLastElem(array).value
    const old_value = getSecondToLastElem(array).value
    return (new_value - old_value) / old_value * 100
  }
  else {
    return 0
  }
}


export default Stock