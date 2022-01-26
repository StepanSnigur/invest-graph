import React, { useRef, useState, useEffect, useContext } from 'react'
import styled from 'styled-components'
import { ThemeContext, IAppTheme } from '../context/ThemeContext'
import { ChartPrices } from './ChartPrices'
import { autorun } from 'mobx'
import { observer } from 'mobx-react-lite'
import { chart } from '../store/chart'
import { Chart as ChartLibrary } from '../canvas/ChartLibrary'

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
`

interface IChart {
  ticker: string
}
export const Chart: React.FC<IChart> = observer(({ ticker }) => {
  const [canvasSize, setCanvasSize] = useState({
    width: 0,
    height: 0,
  })
  const [chartLibrary, setChartLibrary] = useState<ChartLibrary | null>(null)
  const [chartPosition, setChartPosition] = useState({
    top: 0,
    left: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const chartWrapperRef = useRef<HTMLDivElement | null>(null)
  const { colors } = useContext(ThemeContext)

  useEffect(() => {
    setIsLoading(true)
    const ctx = canvasRef.current!.getContext('2d')
    const { top, left } = canvasRef.current!.getBoundingClientRect()
    // chart width without a prices bar
    const canvasWidth = chartWrapperRef.current!.offsetWidth - chartWrapperRef.current!.offsetWidth / 16

    setCanvasSize({
      width: canvasWidth,
      height: chartWrapperRef.current!.offsetHeight,
    })
    const chartLibrary = ctx ? new ChartLibrary(
      canvasWidth,
      chartWrapperRef.current!.offsetHeight,
      colors,
      ctx,
      {
        onCandleFocus: handleCandleFocus
      }
    ) : null
    chartLibrary?.showPreloader()
    setChartLibrary(chartLibrary)
    setChartPosition({
      top,
      left,
    })

    const init = async () => {
      await chart.loadChart(ticker)
      chartLibrary?.hidePreloader()
      setIsLoading(false)
    }
    init()
  }, [chartWrapperRef, colors, ticker])

  // TODO try reaction instead of autorun
  useEffect(() => autorun(() => {
    if (chart.error) {
      onChartError(chart.error)
    } else {
      const { minPrice } = chart.chartData
      chartLibrary?.drawChart(chart.tickerData, minPrice, chart.pricesRange, {
        x: chart.chartData.cursorX,
        y: chart.chartData.cursorY,
      })
    }
  }))

  const handleMouseMove = (e: React.MouseEvent) => {
    const x = e.clientX - chartPosition.left
    const y = e.clientY - chartPosition.top

    !isLoading && chart.moveCursor(x, y)
  }
  const handleMouseLeave = () => {
    if (!isLoading) {
      chart.moveCursor(0, 0)
      chart.setFocusedCandleIdx(null)
    }
  }
  const handleCandleFocus = (candleIdx: number) => {
    chart.setFocusedCandleIdx(candleIdx)
  }
  const onChartError = (error: string) => {
    chartLibrary?.showErrorMessage(error)
  }

  return (
    <ChartWrapper ref={chartWrapperRef}>
      <ChartCanvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        theme={colors}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
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
