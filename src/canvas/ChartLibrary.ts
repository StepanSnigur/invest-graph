import { ChartCore } from './ChartCore'
import { chartConnector } from '../store/chartConnector'
import { ITickerData } from '../store/chart'
import { isStockGoingUp } from '../utils/isStockGoingUp'
import { IThemeColors } from '../context/ThemeContext'
import { Preloader } from './Preloader'
import errorImageUrl from '../assets/images/error-icon.png'
import alertImageUrl from '../assets/images/alert.png'

interface IChartHandlers {
  onCandleFocus: (candleIdx: number) => void
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

class Chart extends ChartCore {
  private handlers: IChartHandlers = {
    onCandleFocus: () => {}
  }
  private preloaderAnimationId: ReturnType<typeof requestAnimationFrame> | null = null
  private chartCandles: IChartCandle[] = []
  private focusedCandle: IChartCandle | null = null
  private tempFocusedCandle: IChartCandle | null = null

  constructor(width: number, height: number, colors: IThemeColors, ctx: CanvasRenderingContext2D, handlers: IChartHandlers) {
    super(width, height, ctx)
    this.handlers = {
      ...this.handlers,
      ...handlers
    }
    this.setChartColors(colors)
  }

  public setMaxCandlesOnScreenCount = (count: number) => {
    this.settings.maxCandlesOnScreenCount = count
  }
  public drawChartCells = () => {
    this.ctx.strokeStyle = this.settings.colors!.button
    this.ctx.lineWidth = 1
    this.ctx.setLineDash([])

    const lines = [...Array(this.settings.gridLinesCount)]
    const verticalGap = this.sizes.width / this.settings.gridLinesCount
    const horizontalGap = this.sizes.height / this.settings.gridLinesCount

    lines.forEach((_, i) => {
      // vertical lines
      this.ctx.beginPath()
      this.ctx.moveTo(verticalGap * i, 0)
      this.ctx.lineTo(verticalGap * i, this.sizes.height)
      this.ctx.stroke()

      // horizontal lines
      this.ctx.beginPath()
      this.ctx.moveTo(0, horizontalGap * i)
      this.ctx.lineTo(this.sizes.width, horizontalGap * i)
      this.ctx.stroke()
    })
  }
  private getCandlesInScope = (candles: ITickerData[], candleWidth: number, offsetX: number) => {
    return candles.filter((candle, i) => {
      const candleX = i * candleWidth + offsetX
      return candleX < this.sizes.width && candleX >= 0
    })
  }
  private sortCandlesPrices = (candlesInScope: ITickerData[]) => {
    return candlesInScope
      .map(value => [+value.open, +value.close])
      .flat()
      .sort((a, b) => a - b)
  }
  private getMinMaxPricesOnFieldOfView = (data: ITickerData[], offsetX: number) => {
    const defaultColumnWidth = this.sizes.width / this.settings.maxCandlesOnScreenCount
    const filteredData = this.getCandlesInScope(data, defaultColumnWidth, offsetX)

    const prices = this.sortCandlesPrices(filteredData)
    const minPrice = prices[0]
    const pricesRange = prices[prices.length -1] - minPrice
    chartConnector.setMinMaxPrices(minPrice, prices[prices.length - 1])

    return { defaultColumnWidth, pricesRange, minPrice }
  }
  public drawChart = (data: ITickerData[], cursorData: ICursorData, offsetX: number) => {
    this.chartCandles = []
    const { defaultColumnWidth, pricesRange, minPrice } = this.getMinMaxPricesOnFieldOfView(data, offsetX)

    this.clearCanvas()

    // remove focused candle if cursor out of chart
    if (!cursorData.x) {
      this.focusedCandle = null
    }

    if (data.length) {
      this.drawChartCells()
      this.drawChartCandles(data, pricesRange, minPrice, defaultColumnWidth, offsetX, cursorData)
      this.drawChartDates(data, offsetX)

      if (cursorData.x !== 0 && cursorData.y !== 0) {
        this.drawChartCursor(cursorData)
        this.tempFocusedCandle?.idx && this.drawCurrentDate(cursorData.x, data[this.tempFocusedCandle.idx].datetime)
      }
    }
  }
  private drawChartCandles = (
    data: ITickerData[],
    pricesRange: number,
    minPrice: number,
    defaultColumnWidth: number,
    offsetX: number,
    cursorData: ICursorData,
  ) => {
    if (!this.settings.colors) throw new Error('You must provide colors to chart')
    const { stockUp, stockDown } = this.settings.colors
    const gapBetweenColumns = defaultColumnWidth * 0.15 // 15% of column width

    data.forEach((tickerData, i) => {
      const { open, close, low, high } = tickerData
      const paintColor = isStockGoingUp(+open, +close) ? stockUp : stockDown
      this.ctx.fillStyle = paintColor

      const topIndent = this.getPricePositionOnChart(+open, minPrice, pricesRange)
      const bottomIndent = this.getPricePositionOnChart(+close, minPrice, pricesRange)
      const topCandleIndent = this.getPricePositionOnChart(+high, minPrice, pricesRange)
      const bottomCandleIndent = this.getPricePositionOnChart(+low, minPrice, pricesRange)

      // draw candle
      const candle: IChartCandle = {
        x: i * defaultColumnWidth + offsetX,
        y: bottomIndent,
        width: defaultColumnWidth - gapBetweenColumns,
        height: topIndent - bottomIndent,
        idx: i,
      }
      this.ctx.fillRect(
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
        this.handlers.onCandleFocus(this.focusedCandle.idx)
      }
      this.chartCandles.push(candle)

      // draw candle tail
      const candleWidth = (defaultColumnWidth - gapBetweenColumns) / 20
      const candleXPosition = (i * defaultColumnWidth + (defaultColumnWidth / 2) - candleWidth) + offsetX
      this.ctx.fillRect(
        candleXPosition,
        bottomCandleIndent,
        candleWidth,
        topCandleIndent - bottomCandleIndent
      )

      if (i === data.length - 1 && cursorData.x === 0 && cursorData.y === 0) {
        this.ctx.strokeStyle = paintColor
        this.setCursorPosition(0, bottomIndent)
      }
    })
  }
  private drawChartDates = (data: ITickerData[], offsetX: number) => {
    if (data.length === 0) return false

    this.ctx.font = '10px Trebuchet MS,roboto,ubuntu,sans-serif'
    const dateTextWidth = this.ctx?.measureText(data[0].datetime).width || 0
    const datesOnScreenCount = Math.floor(this.sizes.width / dateTextWidth) - 2
    const arrDivider = Math.ceil(this.settings.maxCandlesOnScreenCount / datesOnScreenCount)
    const dates = data.map((el, i) => i % arrDivider === 0
      ? { idx: i, ...el }
      : null).filter(el => el !== null)

    const dateWidth = this.sizes.width / datesOnScreenCount
    this.ctx.fillStyle = this.settings.colors?.text || '#000'
    dates.forEach((candle, i) => {
      candle && this.ctx.fillText(candle.datetime, i * dateWidth + offsetX, this.sizes.height - this.settings.datePadding)
    })
  }
  private drawChartCursor = (cursorData: ICursorData) => {
    this.ctx.strokeStyle = this.settings.colors?.text || '#000'
    this.setCursorPosition(cursorData.x, cursorData.y)
  }
  private getPricePositionOnChart = (price: number, minPrice: number, pricesRange: number) => {
    const percentPosition = (price - minPrice) * 100 / pricesRange
    const scaledPosition = (this.sizes.height - (this.sizes.height / 100 * percentPosition)) * this.settings.scaleY
    const scaledHeight = (this.sizes.height - this.sizes.height * this.settings.scaleY) / 2
    return scaledPosition + scaledHeight
  }
  public setCursorPosition = (x: number, y: number) => {
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

      this.focusedCandle = this.getCandle(x)
      if (this.focusedCandle) {
        this.tempFocusedCandle = this.focusedCandle
      }
    }
  }
  public drawCurrentDate = (x: number, date: string) => {
    this.ctx.font = '12px Trebuchet MS,roboto,ubuntu,sans-serif'
    const currentDateSizes = {
      width: this.ctx.measureText(date).width + 30,
      height: 20,
    }
    const xPosition = x - currentDateSizes.width / 2

    this.ctx.fillStyle = this.settings.colors!.button
    this.roundedRect(
      this.ctx, xPosition,
      this.sizes.height - currentDateSizes.height,
      currentDateSizes.width,
      currentDateSizes.height,
      5,
    )

    this.ctx.fillStyle = this.settings.colors!.text
    this.ctx.fillText(date, xPosition + 15, this.sizes.height - currentDateSizes.height / 2 + 3)
  }
  public showPreloader = () => {
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
  public hidePreloader = () => {
    this.preloaderAnimationId && cancelAnimationFrame(this.preloaderAnimationId)
  }
  private getCandle = (cursorX: number) => {
    return this.chartCandles
      .find((candle) => cursorX >= candle.x && cursorX <= candle.x + candle.width) || null
  }
  private drawCandleBorder = (x: number, y: number, width: number, height: number) => {
    this.ctx.strokeStyle = this.settings.colors!.text
    this.ctx.lineWidth = this.settings.focusedCandleBorderWidth * 2
    this.ctx.setLineDash([])
    this.ctx.strokeRect(x, y, width, height)
  }

  public showErrorMessage = (message: string) => {
    this.clearCanvas()
    this.ctx.fillStyle = this.settings.colors!.text
    this.ctx.font = '24px sans-serif'

    const { width } = this.ctx.measureText(message)
    this.ctx.fillText(message, this.sizes.width / 2 - width / 2, this.sizes.height / 2)

    const ERROR_IMAGE_SIZE = 64
    const errorImage = new Image()
    errorImage.src = errorImageUrl
    this.ctx.drawImage(
      errorImage,
      this.sizes.width / 2 - ERROR_IMAGE_SIZE / 2,
      this.sizes.height / 2 - ERROR_IMAGE_SIZE * 1.5,
      ERROR_IMAGE_SIZE,
      ERROR_IMAGE_SIZE,
    )
  }
  public showAlertMessage = (message: string, color?: string) => {
    if (!this.settings.colors) throw new Error('Canvas context is not defined')
    const ALERT_MESSAGE_POSITION = {
      x: 10,
      y: 10,
    }

    this.ctx.font = '18px Trebuchet MS,roboto,ubuntu,sans-serif'
    this.ctx.fillStyle = color || this.settings.colors.alert
    const textMetrics = this.ctx.measureText(message)
    const textHeight = textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent

    const messageWidth = textMetrics.width + 30 // padding horizontal 30
    const messageHeight = textHeight + 20 // padding vertical 20
    const alertImagePadding = 10
    const alertImageSize = messageHeight - alertImagePadding
    this.roundedRect(
      this.ctx,
      ALERT_MESSAGE_POSITION.x,
      ALERT_MESSAGE_POSITION.y,
      messageWidth + alertImageSize,
      messageHeight,
      5,
    )

    this.ctx.fillStyle = this.settings.colors.darkText
    this.ctx.fillText(
      message,
      ALERT_MESSAGE_POSITION.x + messageWidth / 2 - textMetrics.width / 2 + alertImageSize,
      ALERT_MESSAGE_POSITION.y + messageHeight / 2 + textHeight / 2,
    )

    const alertImage = new Image()
    alertImage.src = alertImageUrl
    this.ctx.drawImage(
      alertImage,
      ALERT_MESSAGE_POSITION.x + alertImagePadding / 2,
      ALERT_MESSAGE_POSITION.y + alertImagePadding / 2,
      alertImageSize,
      alertImageSize,
    )
  }
}

export {
  Chart
}
