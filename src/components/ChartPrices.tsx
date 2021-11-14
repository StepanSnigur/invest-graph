import React, { useState, useEffect, useRef, useContext } from 'react'
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
  const [canvasContext, setCanvasContext] = useState<CanvasRenderingContext2D | null>(null)
  const [textMetrics, setTextMetrics] = useState({
    width: 0,
    height:  0,
  })
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const { colors } = useContext(ThemeContext)

  useEffect(() => {
    // returns height from top of chart to price in %
    const getPricePosition = (price: number) => {
      const percentage = 100 * (max - price) / valuesRange
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
      const pricesCount = Math.floor(height / (textMetrics.height + 30) - 2)

      new Array(pricesCount - 1).fill(0).reduce((prev) => {
        const interval = (max - min) / pricesCount
        const curr = prev + interval
        placePriceOnChart(+roundPrice(curr))
        return curr
      }, min)
    }

    if (canvasContext) {
      placeMinMaxPrices()
      placeMedianPrices()
    }
  }, [canvasContext, min, max, height, width, valuesRange, textMetrics])
  useEffect(() => {
    if (canvasRef.current && min && max && height) {
      const ctx = canvasRef.current?.getContext('2d')

      if (ctx) {
        setCanvasContext(ctx)

        ctx.fillStyle = colors.text
        ctx.font = '14px Trebuchet MS,roboto,ubuntu,sans-serif'
        const textMetrics = ctx.measureText(min.toString())
        setTextMetrics({
          width: textMetrics.width,
          height: textMetrics.fontBoundingBoxAscent + textMetrics.fontBoundingBoxDescent
        })

        ctx.clearRect(0, 0, width, height)
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
