import { ITickerData } from '../store/chart'
import { isStockGoingUp } from '../utils/isStockGoingUp'
import { IThemeColors } from '../context/ThemeContext'
import { Preloader } from './Preloader'

interface IChartSettings {
  colors: IThemeColors | null,
  scaleY: number,
  datePadding: number,
  focusedCandleBorderWidth: number,
}
interface ICursorData {
  x: number,
  y: number,
}
interface IChartCandle {
  x: number,
  y: number,
  width: number,
  height: number,
  idx: number,
}
class Chart {
  sizes = {
    width: 0,
    height: 0,
  }
  ctx: CanvasRenderingContext2D | null = null
  settings: IChartSettings = {
    colors: null,
    scaleY: 0.9,
    datePadding: 5,
    focusedCandleBorderWidth: 2,
  }
  preloaderAnimationId: ReturnType<typeof requestAnimationFrame> | null = null
  chartCandles: IChartCandle[] = []
  focusedCandle: IChartCandle | null = null

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
  drawChart = (data: ITickerData[], minPrice: number, pricesRange: number, cursorData: ICursorData) => {
    if (!this.settings.colors) throw new Error('You must provide colors to chart')
    this.chartCandles = []

    this.clearCanvas()
    const canvasHeight = this.sizes.height
    const columnWidth = this.sizes.width / data.length
    const gapBetweenColumns = columnWidth * 0.15 // 15% of column width
    const { stockUp, stockDown, text } = this.settings.colors

    // remove focused candle if cursor out of chart
    if (!cursorData.x) {
      this.focusedCandle = null
    }

    data.forEach((tickerData, i) => {
      const { open, close, low, high } = tickerData
      const paintColor = isStockGoingUp(+open, +close) ? stockUp : stockDown
      const [date, time] = tickerData.datetime.split(' ')
      this.ctx!.fillStyle = paintColor

      const topIndent = this.getPricePositionOnChart(+open, minPrice, pricesRange)
      const bottomIndent = this.getPricePositionOnChart(+close, minPrice, pricesRange)
      const topCandleIndent = this.getPricePositionOnChart(+high, minPrice, pricesRange)
      const bottomCandleIndent = this.getPricePositionOnChart(+low, minPrice, pricesRange)

      // draw candle
      const candle: IChartCandle = {
        x: i * columnWidth,
        y: bottomIndent,
        width: columnWidth - gapBetweenColumns,
        height: topIndent - bottomIndent,
        idx: i,
      }
      this.ctx!.fillRect(
        candle.x,
        candle.y,
        candle.width,
        candle.height,
      )
      if (this.focusedCandle && this.focusedCandle.idx === i) {
        this.drawCandleBorder(
          candle.x - this.settings.focusedCandleBorderWidth,
          candle.y - this.settings.focusedCandleBorderWidth,
          candle.width + this.settings.focusedCandleBorderWidth * 2,
          candle.height + this.settings.focusedCandleBorderWidth * 2
        )
      }
      this.chartCandles.push(candle)

      // draw candle tail
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
        this.ctx!.fillText(time, i * columnWidth, canvasHeight - this.settings.datePadding)
      }
      if (i === data.length - 1 && cursorData.x === 0 && cursorData.y === 0) {
        this.ctx!.strokeStyle = paintColor
        this.setCursorPosition(0, bottomIndent)
      }
    })

    if (cursorData.x !== 0 && cursorData.y !== 0) {
      this.ctx!.strokeStyle = this.settings.colors.text
      this.setCursorPosition(cursorData.x, cursorData.y)
    }
  }
  getPricePositionOnChart = (price: number, minPrice: number, pricesRange: number) => {
    const percentPosition = (price - minPrice) * 100 / pricesRange
    const scaledPosition = (this.sizes.height - (this.sizes.height / 100 * percentPosition)) * this.settings.scaleY
    const scaledHeight = (this.sizes.height - this.sizes.height * this.settings.scaleY) / 2
    return scaledPosition + scaledHeight
  }
  setCursorPosition = (x: number, y: number) => {
    if (!this.ctx) throw new Error('Lost canvas context')

    this.ctx.lineWidth = 2
    this.ctx.setLineDash([8, 12])
    this.ctx.beginPath()
    this.ctx.moveTo(0, y)
    this.ctx.lineTo(this.sizes.width, y)
    this.ctx.stroke()

    if (x > 0) {
      this.ctx.beginPath()
      this.ctx.moveTo(x, 0)
      this.ctx.lineTo(x, this.sizes.height)
      this.ctx.stroke()
    }

    this.focusedCandle = this.getCandle(x)
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
  getCandle = (cursorX: number) => {
    return this.chartCandles
      .find((candle) => cursorX >= candle.x && cursorX <= candle.x + candle.width) || null
  }
  drawCandleBorder = (x: number, y: number, width: number, height: number) => {
    this.ctx!.strokeStyle = this.settings.colors!.text
    this.ctx!.lineWidth = this.settings.focusedCandleBorderWidth * 2
    this.ctx!.setLineDash([])
    this.ctx!.strokeRect(x, y, width, height)
  }
}

export {
  Chart
}
