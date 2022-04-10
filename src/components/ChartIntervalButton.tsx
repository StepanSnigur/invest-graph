import React, { useState, useLayoutEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { chart } from '../store/chart'
import { DropDown } from './DropDown'

const ChartIntervalButton = observer(() => {
  const [currentOptionIndex, setCurrentOptionIndex] = useState(0)

  const intervalOptions = [
    { name: '1min' },
    { name: '5min' },
    { name: '15min' },
    { name: '30min' },
    { name: '45min' },
    { name: '1h' },
    { name: '2h' },
    { name: '4h' },
    { name: '1day' },
    { name: '1week' },
    { name: '1month' },
  ]
  const intevalOptionsValues = Object.values(intervalOptions)

  const handleChartIntervalChange = (optionIdx: number) => {
    if (chart.chartSettings.interval !== intervalOptions[optionIdx].name) {
      setCurrentOptionIndex(optionIdx)
      chart.setInterval(intervalOptions[optionIdx].name)
      chart.loadChart(chart.tickerMeta!.symbol)
    }
  }

  useLayoutEffect(() => {
    const initialOptionIndex = intevalOptionsValues.findIndex(option => option.name === chart.chartSettings.interval)
    setCurrentOptionIndex(initialOptionIndex)
  }, [intevalOptionsValues])

  return (
    <DropDown
      currentOptionIndex={currentOptionIndex}
      options={intervalOptions}
      showIcon={true}
      onChange={handleChartIntervalChange}
    />
  )
})

export { ChartIntervalButton }
