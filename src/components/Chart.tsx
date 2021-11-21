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
  padding: 5px 0;
`

export const Chart = observer(() => {
  const [canvasSize, setCanvasSize] = useState({
    width: 0,
    height: 0,
  })
  const [chartLibrary, setChartLibrary] = useState<ChartLibrary | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const chartWrapperRef = useRef<HTMLDivElement | null>(null)
  const { colors } = useContext(ThemeContext)

  useEffect(() => {
    const ctx = canvasRef.current!.getContext('2d')
    setCanvasSize({
      width: chartWrapperRef.current!.offsetWidth,
      height: chartWrapperRef.current!.offsetHeight,
    })
    const chartLibrary = ctx ? new ChartLibrary(
      chartWrapperRef.current!.offsetWidth,
      chartWrapperRef.current!.offsetHeight,
      colors,
      ctx,
    ) : null
    chartLibrary?.showPreloader()
    setChartLibrary(chartLibrary)

    const init = async () => {
      await chart.loadChart('AAPL')
      chartLibrary?.hidePreloader()
    }
    init()
  }, [chartWrapperRef, colors])

  useEffect(() => autorun(() => {
    const { minPrice } = chart.chartData
    chartLibrary?.drawChart(chart.tickerData, minPrice)
  }))

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
