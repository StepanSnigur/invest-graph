import { ITickerData } from '../store/chart'
import { isStockGoingUp } from '../utils/isStockGoingUp'
import { IThemeColors } from '../context/ThemeContext'
import { Preloader } from './Preloader'

interface IChartSettings {
  colors: IThemeColors | null
}
class Chart {
  sizes = {
    width: 0,
    height: 0,
  }
  ctx: CanvasRenderingContext2D | null = null
  settings: IChartSettings = {
    colors: null
  }
  preloaderAnimationId: ReturnType<typeof requestAnimationFrame> | null = null

  constructor(width: number, height: number, colors: IThemeColors, ctx: CanvasRenderingContext2D) {
    this.sizes = {
      width,
      height
    }

    if (!ctx) throw new Error('You must provide canvas context to chart library')
    this.ctx = ctx
    this.setChartColors(colors)
  }

  clearCanvas = () => {
    this.ctx!.clearRect(0, 0, this.sizes.width, this.sizes.height)
  }
  setChartColors = (colors: IThemeColors) => {
    this.settings.colors = colors
  }
  drawChart = (data: ITickerData[], minPrice: number, pricesRange: number) => {
    if (!this.settings.colors) throw new Error('You must provide colors to chart')

    this.clearCanvas()
    const canvasHeight = this.sizes.height
    const columnWidth = this.sizes.width / data.length
    const gapBetweenColumns = columnWidth * 0.15 // 15% of column width
    const { stockUp, stockDown, text } = this.settings.colors

    data.forEach((tickerData, i) => {
      const { open, close, low, high } = tickerData
      const paintColor = isStockGoingUp(+open, +close) ? stockUp : stockDown
      const [date, time] = tickerData.datetime.split(' ')
      this.ctx!.fillStyle = paintColor

      const topIndent = this.getPricePositionOnChart(+open, minPrice, pricesRange)
      const bottomIndent = this.getPricePositionOnChart(+close, minPrice, pricesRange)
      const topCandleIndent = this.getPricePositionOnChart(+high, minPrice, pricesRange)
      const bottomCandleIndent = this.getPricePositionOnChart(+low, minPrice, pricesRange)

      // draw chart cell
      this.ctx!.fillRect(
        i * columnWidth,
        bottomIndent,
        columnWidth - gapBetweenColumns,
        topIndent - bottomIndent,
      )
      // draw candle
      const candleWidth = (columnWidth - gapBetweenColumns) / 20
      const candleXPosition = i * columnWidth + (columnWidth / 2) - candleWidth
      this.ctx!.fillRect(
        candleXPosition,
        bottomCandleIndent,
        candleWidth,
        topCandleIndent - bottomCandleIndent
      )
      if (i % 3 === 0) {
        this.ctx!.fillStyle = text
        this.ctx!.fillText(time, i * columnWidth, canvasHeight + 15)
      }
      if (i === data.length - 1) {
        this.ctx!.strokeStyle = paintColor
        this.setLastPriceLine(bottomIndent)
      }
    })
  }
  getPricePositionOnChart = (price: number, minPrice: number, pricesRange: number) => {
    const percentPosition = (price - minPrice) * 100 / pricesRange
    return this.sizes.height - (this.sizes.height / 100 * percentPosition)
  }
  setLastPriceLine = (pricePosition: number) => {
    if (!this.ctx) throw new Error('Lost canvas context')

    this.ctx.setLineDash([8, 12])
    this.ctx.beginPath()
    this.ctx.moveTo(0, pricePosition)
    this.ctx.lineTo(this.sizes.width, pricePosition)
    this.ctx.stroke()
  }
  showPreloader = () => {
    if (!this.settings.colors) throw new Error('You must provide colors to chart')

    const preloader = new Preloader(this.ctx, {
      x: this.sizes.width / 2,
      y: this.sizes.height / 2,
      radius: 20,
      width: 2,
      color: this.settings.colors.lightButton,
    })

    const animation = () => {
      preloader.draw()
      this.preloaderAnimationId = requestAnimationFrame(animation)
    }
    requestAnimationFrame(animation)
  }
  hidePreloader = () => {
    this.preloaderAnimationId && cancelAnimationFrame(this.preloaderAnimationId)
  }
}

export {
  Chart
}
