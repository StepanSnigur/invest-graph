import React, { useRef, useState, useEffect } from 'react'
import styled from 'styled-components'
import { useTheme, Theme } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import { ChartPrices } from './ChartPrices'
import { autorun, reaction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { chart } from '../store/chart'
import { chartSketches } from '../store/chartSketches'
import { Chart as ChartLibrary } from '../canvas/ChartLibrary'
import { DrawingLibrary } from '../canvas/DrawingLibrary'
import { EventsManager, IEvent } from '../canvas/EventsManager'
import { debounce } from '../utils/debounce'

import { PaintCanvas } from './PaintCanvas'

const ChartWrapper = styled.div`
  position: relative;
  display: flex;
  box-sizing: border-box;
  width: 80%;
  height: 100%;
`
const CandleInfo = styled.div`
  position: absolute;
  top: 7px;
  left: 7px;
  background: ${({ theme }: { theme: Theme }) => theme.palette.secondary.main};
  padding: 6px 8px;
  border-radius: 8px;
  font-size: 14px;
  color: ${({ theme }: { theme: Theme }) => theme.palette.text.primary};
  opacity: .8;
  z-index: 3;
`
const ChartCanvas = styled.canvas`
  background: transparent;
  border: 1px solid ${({ theme }: { theme: Theme }) => theme.palette.secondary.main};
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
  z-index: 2;
`
const ProgressContainer = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  z-index: 3;
`

interface IChart {
  ticker: string
}
interface IDragData {
  startX: number | null
}
export const Chart: React.FC<IChart> = observer(({ ticker }) => {
  const [canvasSize, setCanvasSize] = useState({
    width: 0,
    height: 0,
  })
  const [chartLibrary, setChartLibrary] = useState<ChartLibrary | null>(null)
  const [drawingLibrary, setDrawingLibrary] = useState<DrawingLibrary | null>(null)
  const [chartPosition, setChartPosition] = useState({
    top: 0,
    left: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [dragData, setDragData] = useState<IDragData>({
    startX: null
  })
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const chartWrapperRef = useRef<HTMLDivElement | null>(null)
  const theme = useTheme()

  useEffect(() => { // set up all needed libraries
    // init event manager
    chart.setCanvasElementWidth(canvasSize.width)
    const debouncedDataCheck = debounce(() => chart.checkNewData(), 1000)
    const events: IEvent[] = [
      { // resize by x
        buttons: ['x'],
        wheelSpinning: true,
        handler: (delta: number) => {
          chart.setMaxCandlesOnScreenCount(delta / 10)
          chart.checkNewData()
        },
      },
      { // scroll
        buttons: [],
        wheelSpinning: true,
        handler: (delta: number) => {
          chart.setPrevOffsetX()
          chart.setPrevDrawingsOffsetX()
          chart.setOffsetX(delta / 5)
          debouncedDataCheck()
        },
      },
      { // resize by y
        buttons: ['y'],
        wheelSpinning: true,
        handler: (delta: number) => {
          chart.setYScale(delta / 1000)
        },
      },
    ]
    const eventsManager = new EventsManager(chartWrapperRef.current!, events)

    // draw chart
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
      theme,
      ctx,
      {
        onCandleFocus: handleCandleFocus,
      },
    ) : null
    chartLibrary?.setMaxCandlesOnScreenCount(chart.chartSettings.maxCandlesOnScreenCount)
    chartLibrary?.setChartYScale(chart.chartSettings.scaleY)
    setChartLibrary(chartLibrary)

    const drawingLibrary = ctx ? new DrawingLibrary(canvasWidth, chartWrapperRef.current!.offsetHeight, ctx) : null
    drawingLibrary?.setChartColors(theme)
    drawingLibrary?.setChartYScale(chart.chartSettings.scaleY)
    setDrawingLibrary(drawingLibrary)

    setChartPosition({
      top,
      left,
    })

    return eventsManager.removeListeners
  }, [chartWrapperRef, theme, ticker, canvasSize.width])
  useEffect(() => {
    const init = async () => {
      setIsLoading(true)
      await chart.loadChart(ticker)
      setIsLoading(false)
    }
    init()

    return chart.unsubscribeFromUpdates
  }, [ticker])

  useEffect(() => reaction(
    () => chart.chartSettings.scaleY,
    () => {
      chartLibrary?.setChartYScale(chart.chartSettings.scaleY)
      drawingLibrary?.setChartYScale(chart.chartSettings.scaleY)
      chartLibrary?.drawChart(chart.tickerData, {
        x: chart.chartData.cursorX,
        y: chart.chartData.cursorY,
      }, chart.chartData.offsetX)
    }
  ))
  useEffect(() => reaction(
    () => chart.chartSettings.maxCandlesOnScreenCount,
    () => {
      chartLibrary?.setMaxCandlesOnScreenCount(chart.chartSettings.maxCandlesOnScreenCount)
      chartLibrary?.drawChart(chart.tickerData, {
        x: chart.chartData.cursorX,
        y: chart.chartData.cursorY,
      }, chart.chartData.offsetX)
    }
  ))
  useEffect(() => autorun(() => {
    if (chart.error) {
      onChartError(chart.error)
    } else {
      chartLibrary?.drawChart(chart.tickerData, {
        x: chart.chartData.cursorX,
        y: chart.chartData.cursorY,
      }, chart.chartData.offsetX)
    }
  }))

  const handleMouseMove = (e: React.MouseEvent) => {
    const x = e.clientX - chartPosition.left
    const y = e.clientY - chartPosition.top

    !isLoading && !chart.error && chart.moveCursor(x, y)

    if (!isLoading && dragData.startX !== null && !chartSketches.isDrawingTools && !chartSketches.isDrawing) {
      const delta = e.pageX - dragData.startX
      chart.setOffsetX(delta)
    }

    if (chartSketches.isDrawingTools && chartSketches.toolDrawIndex !== null) {
      const toY = drawingLibrary?.getCurrentPrice(y)
      toY && chartSketches.changeLastToolDrawingPosition({
        x: x - chart.chartData.drawingsOffsetX,
        y: toY,
      })
    }
  }
  const handleMouseLeave = () => {
    if (!isLoading) {
      chart.moveCursor(0, 0)
      chart.setFocusedCandleIdx(null)
    }
  }
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setDragData({
      startX: e.pageX,
    })
    if (chartSketches.isDrawing) {
      chartSketches.startDrawing()
      chartSketches.setMouseDown(true)
    }
  }
  const handleMouseUp = async () => {
    setDragData({
      startX: null,
    })
    await chart.checkNewData()
    chart.setPrevOffsetX()
    chart.setPrevDrawingsOffsetX()
    if (chartSketches.isDrawing) {
      chartSketches.setMouseDown(false)
    }
  }
  const handleMouseClick = () => {
    if (chartSketches.isDrawingTools && chartSketches.toolDrawIndex !== null) {
      chartSketches.setToolsDrawingMode(false)
      chartSketches.setToolDrawIndex(null)
      return false
    }
    if (chartSketches.isDrawingTools) {
      const fromY = drawingLibrary?.getCurrentPrice(chart.chartData.cursorY)
      if (fromY) {
        chartSketches.addChartTool({
          from: {
            x: chart.chartData.cursorX - chart.chartData.drawingsOffsetX,
            y: fromY,
          },
          to: {
            x: null,
            y: null,
          },
          drawFunction: chartSketches.isDrawingTools,
          lineWidth: chart.drawSettings.pencilLineWidth,
        })
        chartSketches.setToolDrawIndex(chartSketches.toolDrawings.length - 1)
      }
    }
  }

  const handleCandleFocus = (candleIdx: number) => {
    chart.setFocusedCandleIdx(candleIdx)
  }
  const onChartError = (error: string) => {
    chartLibrary?.showErrorMessage(error)
  }

  const currentCandle = chart.tickerData[chart.focusedCandleIdx ?? chart.tickerData.length - 1]
  return (
    <ChartWrapper ref={chartWrapperRef}>
      {isLoading ? <ProgressContainer>
        <CircularProgress />
      </ProgressContainer> : null}
      <ChartCanvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        theme={theme}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onClick={handleMouseClick}
      >
        Браузер не поддерживает Canvas
      </ChartCanvas>
      <PaintCanvas
        width={canvasSize.width}
        height={canvasSize.height}
        x={chart.chartData.cursorX - chart.chartData.drawingsOffsetX}
        y={chart.chartData.cursorY}
      />

      <ChartPrices
        width={canvasSize.width / 16}
        height={canvasSize.height}
      />
      {chart.focusedCandleIdx ? <CandleInfo theme={theme}>
        МАКС {currentCandle?.high} | МИН {currentCandle?.low} | ОТКР {currentCandle?.open} | ЗАКР {currentCandle?.close}
      </CandleInfo> : null}
    </ChartWrapper>
  )
})
