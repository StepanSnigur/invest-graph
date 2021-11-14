import React, { useEffect, useRef, useContext } from 'react'
import styled from 'styled-components'
import { ThemeContext, IAppTheme } from '../context/ThemeContext'
import { roundPrice } from '../utils/roundPrice'

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
  min: number,
  max: number,
  current: number,
  valuesRange: number,
}
export const ChartPrices: React.FC<IChartPrices> = ({
  width,
  height,
  min,
  max,
  current,
  valuesRange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const { colors } = useContext(ThemeContext)

  useEffect(() => {
    // returns height from top of chart to price in %
    const placePriceOnChart = (price: number) => {
      const percentage = 100 * (max - price) / valuesRange
      return height / 100 * percentage
    }

    if (canvasRef.current && min && max) {
      const ctx = canvasRef.current?.getContext('2d')

      if (ctx) {
        ctx.clearRect(0, 0, width, height)
        const minPricePosition = placePriceOnChart(min)
        const maxPricePosition = placePriceOnChart(max)
        console.log(minPricePosition + 100, maxPricePosition - 100)

        ctx.fillStyle = colors.text
        ctx.font = '14px sans-serif'
        ctx.fillText(roundPrice(min).toString(), width / 6, minPricePosition - 10)
        ctx.fillText(roundPrice(max).toString(), width / 6, maxPricePosition + 12)
      }
    }
  }, [min, max, width, height, valuesRange, colors, canvasRef])
  useEffect(() => {

  }, [current, canvasRef])

  return (
    <PricesCanvas
      ref={canvasRef}
      width={width}
      height={height}
      theme={colors}
    />
  )
}
