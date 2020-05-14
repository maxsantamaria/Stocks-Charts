import React, { useState, useEffect } from 'react'

const Exchange = ({ exchange, infoExchange, buyVolumes, parser, sellVolumes }) => {
  const [buyVolume, setBuyVolume] = useState(0)
  const [sellVolume, setSellVolume] = useState(0)
  const [marketBuyVolume, setMarketBuyVolume] = useState(0)
  const [marketSellVolume, setMarketSellVolume] = useState(0)
  const [marketShare, setMarketShare] = useState(0)
  useEffect(() => {
    let volume = 0
    for (var i = 0; i < infoExchange.listed_companies.length; i++) {
      const company = infoExchange.listed_companies[i]
      if (Object.keys(parser).length > 0 && parser[company] in buyVolumes) {
        volume += buyVolumes[parser[company]]  
      }
    }
    setBuyVolume(volume)
    let total_volume = 0
    for(var key in buyVolumes) {
      total_volume += buyVolumes[key]
    }
    setMarketBuyVolume(total_volume)
    setMarketShare((volume + sellVolume) / (total_volume + marketSellVolume) * 100)
  }, [buyVolumes])

  useEffect(() => {
    let volume = 0
    for (var i = 0; i < infoExchange.listed_companies.length; i++) {
      const company = infoExchange.listed_companies[i]
      if (Object.keys(parser).length > 0 && parser[company] in sellVolumes) {
        volume += sellVolumes[parser[company]]
      }
    }
    setSellVolume(volume)
    let total_volume = 0
    for(var key in sellVolumes) {
      total_volume += sellVolumes[key]
    }
    setMarketSellVolume(total_volume)
    setMarketShare((buyVolume + volume) / (total_volume + marketBuyVolume) * 100)
  }, [sellVolumes])

  return (
    <div className="container-exchange border">
      <div className="container-exchange-title border" >
        Mercado {exchange}
        <span class="tooltiptext">
          {infoExchange.listed_companies.map(company => <div>- {company}</div>)}
        </span>
      </div>
      <table className="my-table">
        <tbody>
          <tr className="bottom-border">
            <td>Volumen Compra: </td>
            <td>{buyVolume}</td>
          </tr>
          <tr className="bottom-border">
            <td>Volumen Venta: </td>
            <td>{sellVolume}</td>
          </tr>
          <tr className="bottom-border">
            <td>Volumen total: </td>
            <td>{buyVolume + sellVolume}</td>
          </tr>
          <tr className="bottom-border">
            <td>Cantidad acciones: </td>
            <td>{infoExchange.listed_companies.length}</td>
          </tr>
          <tr>
            <td>Participación de mercado: </td>
            <td>{marketShare.toFixed(2)}%</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default Exchange