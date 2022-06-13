import React, { useRef, useEffect, useContext } from 'react'
import { ThemeContext, IAppTheme } from '../context/ThemeContext'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { autorun } from 'mobx'
import { chart } from '../store/chart'
import { chartConnector } from '../store/chartConnector'
import { chartSketches } from '../store/chartSketches'

import { paintCanvasWorkerScript } from '../workers/PaintCanvasWorker'
const paintCanvasWorker = new Worker(paintCanvasWorkerScript)

const PaintCanvasElement = styled.canvas`
  position: absolute;
  background: ${(props: IAppTheme) => props.theme.secondaryBackground};
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
  z-index: 1;
`
const getCurrentPrice = (y: number, height: number, minChartPrice: number, maxChartPrice: number, scaleY: number) => {
  const scaledHeight = height * scaleY
  const clippedHeight = (height - scaledHeight) / 2
  const percentPosition = ((scaledHeight + clippedHeight) - y) * 100 / scaledHeight
  return (percentPosition * (maxChartPrice - minChartPrice) / 100) + minChartPrice
}

export interface IPaintData {
  x: number,
  y: number,
}
interface IPaintCanvas {
  width: number,
  height: number,
  x: number,
  y: number,
}
export const PaintCanvas: React.FC<IPaintCanvas> = observer(({
  width,
  height,
  x,
  y,
}) => {
  const paintCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const { colors } = useContext(ThemeContext)

  useEffect(() => {
    if (paintCanvasRef.current && width && height) {
      const offscreenCanvas = (paintCanvasRef.current as any).transferControlToOffscreen()
      paintCanvasWorker.postMessage({ offscreenCanvas }, [offscreenCanvas])
    }
  }, [paintCanvasRef, width, height])
  useEffect(() => {
    if (x && y && chartSketches.isDrawing && chartSketches.mouseDown) {
      const { minChartPrice, maxChartPrice } = chartConnector.data
      chartSketches.addPointToDraw(
        x,
        getCurrentPrice(y, height, minChartPrice, maxChartPrice, chart.chartSettings.scaleY),
      )
    }
  }, [x, y, height])
  useEffect(() => {
    autorun(() => {
      paintCanvasWorker.postMessage({
        sketches: JSON.stringify(chartSketches.sketches),
        offsetX: chart.chartData.drawingsOffsetX,
        scaleY: chart.chartSettings.scaleY,
        minPrice: chartConnector.data.minChartPrice,
        maxPrice: chartConnector.data.maxChartPrice,
      })
    })
  }, [])

  return (
    <PaintCanvasElement
      ref={paintCanvasRef}
      width={width}
      height={height}
      theme={colors}
    >
      Браузер не поддерживает Canvas
    </PaintCanvasElement>
  )
})
