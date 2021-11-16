import React, { useRef, useState, useEffect, useContext } from 'react'
import styled from 'styled-components'
import { ThemeContext, IAppTheme } from '../context/ThemeContext'
import { isStockGoingUp } from '../utils/isStockGoingUp'
import { ChartPrices } from './ChartPrices'
import { observer } from 'mobx-react-lite'
import { chart } from '../store/chart'

const ChartWrapper = styled.div`
  display: flex;
  box-sizing: border-box;
  width: 80%;
  height: 100%;
`
const ChartCanvas = styled.canvas`
  background: ${(props: IAppTheme) => props.theme.secondaryBackground};
  border: 2px solid ${(props: IAppTheme) => props.theme.lightButton};
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  padding: 5px 0;
`

export const Chart = observer(() => {
  const [canvasSize, setCanvasSize] = useState({
    width: 0,
    height: 0,
  })
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const chartWrapperRef = useRef<HTMLDivElement | null>(null)
  const { colors } = useContext(ThemeContext)

  useEffect(() => {
    chartWrapperRef.current && setCanvasSize({
      width: chartWrapperRef.current?.offsetWidth,
      height: chartWrapperRef.current?.offsetHeight,
    })
    chart.loadChart('AAPL')
  }, [chartWrapperRef])
  useEffect(() => {
    const { minPrice } = chart.chartData
    const canvasWidth = canvasSize.width
    const canvasHeight = canvasSize.height

    const columnWidth = canvasWidth / chart.tickerData.length
    const ctx = canvasRef.current?.getContext('2d')

    if (ctx && chart.tickerData.length) {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight)
      chart.tickerData.forEach((data, i) => {
        const { open, close } = data
        const [date, time] = data.datetime.split(' ')
        ctx.fillStyle = isStockGoingUp(+open, +close) ? colors.stockUp : colors.stockDown

        const openValuePosition = (+open - minPrice) * 100 / chart.pricesRange
        const closeValuePosition = (+close - minPrice) * 100 / chart.pricesRange

        const topIndent = canvasHeight - (canvasHeight / 100 * openValuePosition)
        const bottomIndent = canvasHeight - (canvasHeight / 100 * closeValuePosition)

        ctx.fillRect(i * columnWidth, bottomIndent, columnWidth - 10, topIndent - bottomIndent)
        if (i % 3 === 0) {
          ctx.fillText(time, i * columnWidth, canvasHeight + 15, columnWidth - 10)
          ctx.fillText(date, i * columnWidth, canvasHeight + 25, columnWidth - 10)
        }
      })
    }
  }, [canvasSize, colors])

  return (
    <ChartWrapper ref={chartWrapperRef}>
      <ChartCanvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height + 30}
        theme={colors}
      >
        Браузер не поддерживает Canvas
      </ChartCanvas>
      <ChartPrices
        width={canvasSize.width / 16}
        height={canvasSize.height}
      />
    </ChartWrapper>
  )
})
