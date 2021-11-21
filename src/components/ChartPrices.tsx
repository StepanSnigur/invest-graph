import React, { useState, useEffect, useRef, useContext } from 'react'
import styled from 'styled-components'
import { ThemeContext, IAppTheme } from '../context/ThemeContext'
import { roundPrice } from '../utils/roundPrice'
import { autorun } from 'mobx'
import { observer } from 'mobx-react-lite'
import { chart } from '../store/chart'

const PricesCanvas = styled.canvas`
  background: ${(props: IAppTheme) => props.theme.secondaryBackground};
  border: 2px solid ${(props: IAppTheme) => props.theme.lightButton};
  border-left: none;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  padding-bottom: 25px;
`

interface IChartPrices {
  width: number,
  height: number,
}
export const ChartPrices: React.FC<IChartPrices> = observer(({ width, height, }) => {
  const [canvasContext, setCanvasContext] = useState<CanvasRenderingContext2D | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const { colors } = useContext(ThemeContext)

  useEffect(() => autorun(() => {
    if (!canvasContext) return false

    const textMeasures = canvasContext.measureText(roundPrice(chart.chartData.minPrice).toString())
    const textMetrics = {
      width: textMeasures?.width,
      height: textMeasures?.fontBoundingBoxAscent + textMeasures?.fontBoundingBoxDescent,
    }
    const min = chart.chartData.minPrice
    const max = chart.chartData.maxPrice

    // returns height from top of chart to price in %
    const getPricePosition = (price: number) => {
      const percentage = 100 * (max - price) / chart.pricesRange
      return height / 100 * percentage
    }
    const placePriceOnChart = (price: number, defaultPosition?: number) => {
      canvasContext && canvasContext.fillText(
        roundPrice(price).toString(),
        Math.trunc((width - textMetrics.width) / 2),
        Math.trunc(defaultPosition || getPricePosition(price)),
      )
    }
    const placeMinMaxPrices = () => {
      const minPricePosition = getPricePosition(min)
      const maxPricePosition = getPricePosition(max)

      placePriceOnChart(min, minPricePosition - 10)
      placePriceOnChart(max, maxPricePosition + 14)
      // ctx.fillText(roundPrice(min).toString(), (width - textWidth) / 2, minPricePosition - 10)
      // ctx.fillText(roundPrice(max).toString(), (width - textWidth) / 2, maxPricePosition + 12)
    }
    const placeMedianPrices = () => {
      const pricesCount = Math.floor(height / (textMetrics.height + 40) - 2)

      new Array(pricesCount - 1).fill(0).reduce((prev) => {
        const interval = (max - min) / pricesCount
        const curr = prev + interval
        placePriceOnChart(+roundPrice(curr))
        return curr
      }, min)
    }

    placeMinMaxPrices()
    placeMedianPrices()
  }))
  useEffect(() => {
    if (canvasRef.current && height) {
      const ctx = canvasRef.current?.getContext('2d')

      if (ctx) {
        setCanvasContext(ctx)

        ctx.fillStyle = colors.text
        ctx.font = '14px Trebuchet MS,roboto,ubuntu,sans-serif'

        ctx.clearRect(0, 0, width, height)
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
