import React, { useState, useEffect } from 'react'
import { createChart } from 'lightweight-charts';


const LightWeightChart = ({ data, stock }) => {
  const [chart, setChart] = useState(null)
  const [series, setSeries] = useState(null)
  useEffect(() => {
    
    const chart = createChart(`chart-${stock}`, { 
      width: 600, 
      height: 300,
      layout: {
        backgroundColor: '#000',
        textColor: 'rgba(255, 255, 255, 0.8)',
      },
      grid: {
        vertLines: {
          color: 'rgba(255, 255, 255, 0.2)',
        },
        horzLines: {
          color: 'rgba(255, 255, 255, 0.2)',
        },
      },
      priceScale: {
        borderColor: 'rgba(255, 255, 255, 0.8)',
      },
      timeScale: {
        borderColor: 'rgba(255, 255, 255, 0.8)',
      }, 
    })
    chart.timeScale().applyOptions({
      timeVisible: true,
      secondsVisible: true
    })
    const lineSeries = chart.addLineSeries();
    lineSeries.setData(
      data  
    )

    setSeries(lineSeries)
    setChart(chart)

  
  }, [])
  useEffect(() => {
    if (series) {
      series.setData(data)
    }
  }, [data])
  return (
    <div id={`chart-${stock}`} />  
  )
}

export default LightWeightChart