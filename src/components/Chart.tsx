import React, { useRef, useState, useEffect, useContext } from 'react'
import styled from 'styled-components'
import { ThemeContext, IAppTheme } from '../context/ThemeContext'
import { ChartPrices } from './ChartPrices'
import { autorun, reaction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { chart } from '../store/chart'
import { chartConnector } from '../store/chartConnector'
import { Chart as ChartLibrary } from '../canvas/ChartLibrary'
import { DrawingLibrary, ICoordinates } from '../canvas/DrawingLibrary'
import { EventsManager, IEvent } from '../canvas/EventsManager'
import { debounce } from '../utils/debounce'

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
  background: ${(props: IAppTheme) => props.theme.button};
  padding: 6px 8px;
  border-radius: 8px;
  font-size: 14px;
  color: ${(props: IAppTheme) => props.theme.text};
  opacity: .8;
`
const ChartCanvas = styled.canvas`
  background: ${(props: IAppTheme) => props.theme.secondaryBackground};
  border: 1px solid ${(props: IAppTheme) => props.theme.lightButton};
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
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
  const { colors } = useContext(ThemeContext)

  useEffect(() => {
    // init event manager
    const debouncedDataCheck = debounce(() => chart.checkNewData(canvasSize.width), 1000)
    const events: IEvent[] = [
      {
        buttons: ['x'],
        wheelSpinning: true,
        handler: (delta: number) => console.log(delta, 'scale'),
      },
      {
        buttons: [],
        wheelSpinning: true,
        handler: (delta: number) => {
          chart.setPrevOffsetX()
          chart.setOffsetX(delta / 5)
          debouncedDataCheck()
        },
      },
      {
        buttons: ['y'],
        wheelSpinning: true,
        handler: (delta: number) => {
          chartConnector.setYScale(delta / 1000)
        },
      },
    ]
    const eventsManager = new EventsManager(chartWrapperRef.current!, events)

    // draw chart
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
        onCandleFocus: handleCandleFocus,
      },
    ) : null
    if (canvasSize.width > 0) chartLibrary?.showPreloader()
    chartLibrary?.setMaxCandlesOnScreenCount(chart.chartSettings.maxCandlesOnScreenCount)
    setChartLibrary(chartLibrary)

    const drawingLibrary = ctx ? new DrawingLibrary(canvasWidth, chartWrapperRef.current!.offsetHeight, ctx) : null
    drawingLibrary?.setChartColors(colors)
    setDrawingLibrary(drawingLibrary)

    setChartPosition({
      top,
      left,
    })

    const init = async () => {
      await chart.loadChart(ticker)
      chartLibrary?.hidePreloader()
      setIsLoading(false)
    }
    (canvasSize.width > 0) && init()

    return eventsManager.removeListeners
  }, [chartWrapperRef, colors, ticker, canvasSize.width])

  useEffect(() => reaction(
    () => chartConnector.settings.scaleY,
    () => {
      chartLibrary?.setChartYScale(chartConnector.settings.scaleY)
      chartLibrary?.drawChart(chart.tickerData, {
        x: chart.chartData.cursorX,
        y: chart.chartData.cursorY,
      }, chart.chartData.offsetX)
    }
  ))
  useEffect(() => reaction(
    () => chart.chartDrawings,
    () => {
      // clear chart from drawings
      if (chart.chartDrawings.length === 0) {
        chartLibrary?.drawChart(chart.tickerData, {
          x: chart.chartData.cursorX,
          y: chart.chartData.cursorY,
        }, chart.chartData.offsetX)
      }
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
      chart.alertMessage && chartLibrary?.showAlertMessage(chart.alertMessage)
    }
  }))

  useEffect(() => autorun(() => {
    if (chart.chartDrawings.length > 0) {
      chart.chartDrawings.forEach(drawing => {
        if (drawingLibrary && drawing.to.x !== null && drawing.to.y !== null) {
          drawingLibrary[drawing.drawFunction](drawing.from, drawing.to as ICoordinates, chart.chartData.offsetX)
        }
      })
    }
  }))

  const handleMouseMove = (e: React.MouseEvent) => {
    const x = e.clientX - chartPosition.left
    const y = e.clientY - chartPosition.top

    !isLoading && chart.moveCursor(x, y)

    if (!isLoading && dragData.startX !== null) {
      const delta = e.pageX - dragData.startX
      chart.setOffsetX(delta)
    }

    if (chart.isInDrawingMode && chart.drawIndex !== null) {
      const toY = drawingLibrary?.getCurrentPrice(y)
      toY && chart.changeLastDrawingPosition({
        x: x - chart.chartData.offsetX,
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
  }
  const handleMouseUp = async () => {
    setDragData({
      startX: null,
    })
    await chart.checkNewData(canvasSize.width)
    chart.setPrevOffsetX()
  }
  const handleMouseClick = () => {
    if (chart.isInDrawingMode && chart.drawIndex !== null) {
      chart.setIsInDrawingMode(false)
      chart.setDrawIndex(null)
      return false
    }
    if (chart.isInDrawingMode) {
      const fromY = drawingLibrary?.getCurrentPrice(chart.chartData.cursorY)
      if (fromY) {
        chart.addChartDrawing({
          from: {
            x: chart.chartData.cursorX - chart.chartData.offsetX,
            y: fromY,
          },
          to: {
            x: null,
            y: null,
          },
          drawFunction: chart.isInDrawingMode,
        })
        chart.setDrawIndex(chart.chartDrawings.length - 1)
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
      <ChartCanvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        theme={colors}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onClick={handleMouseClick}
      >
        Браузер не поддерживает Canvas
      </ChartCanvas>
      <ChartPrices
        width={canvasSize.width / 16}
        height={canvasSize.height}
      />
      {chart.focusedCandleIdx ? <CandleInfo theme={colors}>
        МАКС {currentCandle?.high} | МИН {currentCandle?.low} | ОТКР {currentCandle?.open} | ЗАКР {currentCandle?.close}
      </CandleInfo> : null}
    </ChartWrapper>
  )
})
