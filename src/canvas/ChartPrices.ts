import { IThemeColors } from '../context/ThemeContext'
import { roundPrice } from '../utils/roundPrice'

interface IChartSettings {
  colors: IThemeColors | null,
  minPrice: number,
  maxPrice: number,
}
class ChartPrices {
  sizes = {
    width: 0,
    height: 0,
  }
  ctx: CanvasRenderingContext2D | null = null
  settings: IChartSettings = {
    colors: null,
    minPrice: 0,
    maxPrice: 0,
  }
  textMetrics = {
    width: 0,
    height: 0,
  }

  constructor(
    width: number,
    height: number,
    colors: IThemeColors,
    ctx: CanvasRenderingContext2D,
  ) {
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
  setMinMaxPrices = (minPrice: number, maxPrice: number) => {
    this.settings.minPrice = minPrice
    this.settings.maxPrice = maxPrice
    this.setTextMetrics()
  }
  setTextMetrics = () => {
    const textMeasures = this.ctx!.measureText(roundPrice(this.settings.minPrice).toString())
    this.textMetrics = {
      width: textMeasures?.width,
      height: textMeasures?.fontBoundingBoxAscent + textMeasures?.fontBoundingBoxDescent,
    }
  }
  getPricePosition = (price: number) => {
    const percentage = 100 * (this.settings.maxPrice - price) / Math.abs(this.settings.maxPrice - this.settings.minPrice)
    return this.sizes.height / 100 * percentage
  }
  placePriceOnChart = (price: number, defaultPosition?: number) => {
    this.ctx && this.ctx.fillText(
      roundPrice(price).toString(),
      Math.trunc((this.sizes.width - this.textMetrics.width) / 2),
      Math.trunc(defaultPosition || this.getPricePosition(price)),
    )
  }

  placeMinMaxPrices = () => {
    const minPricePosition = this.getPricePosition(this.settings.minPrice)
    const maxPricePosition = this.getPricePosition(this.settings.maxPrice)

    this.placePriceOnChart(this.settings.minPrice, minPricePosition - 10)
    this.placePriceOnChart(this.settings.maxPrice, maxPricePosition + 14)
  }
  placeMedianPrices = () => {
    const pricesCount = Math.floor(this.sizes.height / (this.textMetrics.height + 40) - 2)

    new Array(pricesCount - 1).fill(0).reduce((prev) => {
      const interval = (this.settings.maxPrice - this.settings.minPrice) / pricesCount
      const curr = prev + interval
      this.placePriceOnChart(+roundPrice(curr))
      return curr
    }, this.settings.minPrice)
  }
  drawChart = () => {
    this.clearCanvas()
    this.placeMinMaxPrices()
    this.placeMedianPrices()
  }
}

export {
  ChartPrices
}
