import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { useTheme, Theme } from '@mui/material'
import { autorun, reaction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { chart } from '../store/chart'
import { chartConnector } from '../store/chartConnector'
import { ChartPrices as PricesChart } from '../canvas/ChartPrices'

const PricesCanvas = styled.canvas`
  background: ${({ theme }: { theme: Theme }) => theme.palette.background.default};
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
  border: 1px solid ${({ theme }: { theme: Theme }) => theme.palette.primary.main};
`

interface IChartPrices {
  width: number,
  height: number,
}
export const ChartPrices: React.FC<IChartPrices> = observer(({ width, height, }) => {
  const [pricesLibrary, setPricesLibrary] = useState<PricesChart | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const theme = useTheme()

  useEffect(() => reaction(
    () => chart.chartSettings.scaleY,
    () => {
      pricesLibrary?.setChartYScale(chart.chartSettings.scaleY)
    }
  ))
  useEffect(() => autorun(() => {
    const { minChartPrice, maxChartPrice } = chartConnector.data
    if (pricesLibrary && minChartPrice && maxChartPrice) {
      pricesLibrary.setMinMaxPrices(minChartPrice, maxChartPrice)
      pricesLibrary.drawChart()
    }
    if (pricesLibrary && chart.chartData.cursorX) {
      const currentPrice = pricesLibrary.getCurrentPrice(chart.chartData.cursorY)
      pricesLibrary.drawCurrentPrice(currentPrice, chart.chartData.cursorY)
    }
  }))
  useEffect(() => {
    if (canvasRef.current && height) {
      const ctx = canvasRef.current?.getContext('2d')

      if (ctx) {
        const pricesLibrary = new PricesChart(width, height, theme, ctx)
        pricesLibrary?.setChartYScale(chart.chartSettings.scaleY)
        pricesLibrary.drawChart()
        setPricesLibrary(pricesLibrary)

        ctx.fillStyle = theme.palette.text.primary
        ctx.font = '14px Trebuchet MS,roboto,ubuntu,sans-serif'
      }
    }
  }, [width, height, theme, canvasRef])

  return (
    <PricesCanvas
      ref={canvasRef}
      width={width}
      height={height}
      theme={theme}
    />
  )
})
