import React, { useState, useEffect, useRef, useContext } from 'react'
import styled from 'styled-components'
import { ThemeContext, IAppTheme } from '../context/ThemeContext'
import { autorun } from 'mobx'
import { observer } from 'mobx-react-lite'
import { chart } from '../store/chart'
import { chartConnector } from '../store/chartConnector'
import { ChartPrices as PricesChart } from '../canvas/ChartPrices'

const PricesCanvas = styled.canvas`
  background: ${(props: IAppTheme) => props.theme.secondaryBackground};
  border: 2px solid ${(props: IAppTheme) => props.theme.lightButton};
  border-left: none;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
`

interface IChartPrices {
  width: number,
  height: number,
}
export const ChartPrices: React.FC<IChartPrices> = observer(({ width, height, }) => {
  const [pricesLibrary, setPricesLibrary] = useState<PricesChart | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const { colors } = useContext(ThemeContext)

  useEffect(() => autorun(() => {
    const { minChartPrice, maxChartPrice } = chartConnector.data
    if (pricesLibrary && minChartPrice && maxChartPrice) {
      pricesLibrary.setMinMaxPrices(minChartPrice, maxChartPrice)
      pricesLibrary.drawChart()
    }
  }))
  useEffect(() => {
    if (canvasRef.current && height) {
      const ctx = canvasRef.current?.getContext('2d')

      if (ctx) {
        const pricesLibrary = new PricesChart(width, height, colors, ctx)
        pricesLibrary.drawChart()
        setPricesLibrary(pricesLibrary)

        ctx.fillStyle = colors.text
        ctx.font = '14px Trebuchet MS,roboto,ubuntu,sans-serif'
      }
    }
  }, [width, height, colors, canvasRef])

  return (
    <PricesCanvas
      ref={canvasRef}
      width={width}
      height={height}
      theme={colors}
    />
  )
})
