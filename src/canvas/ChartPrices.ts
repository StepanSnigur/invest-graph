import { ChartCore } from './ChartCore'
import { IThemeColors } from '../context/ThemeContext'
import { roundPrice } from '../utils/roundPrice'

interface IChartPricesSettings {
  minPrice: number,
  maxPrice: number,
}
class ChartPrices extends ChartCore {
  pricesSettings: IChartPricesSettings = {
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
    super(width, height, ctx)
    this.setChartColors(colors)
  }

  setMinMaxPrices = (minPrice: number, maxPrice: number) => {
    this.pricesSettings.minPrice = minPrice
    this.pricesSettings.maxPrice = maxPrice
    this.setTextMetrics()
  }
  setTextMetrics = () => {
    const textMeasures = this.ctx!.measureText(roundPrice(this.pricesSettings.minPrice).toString())
    this.textMetrics = {
      width: textMeasures?.width,
      height: textMeasures?.fontBoundingBoxAscent + textMeasures?.fontBoundingBoxDescent,
    }
  }
  placePriceOnChart = (price: number, defaultPosition?: number) => {
    this.ctx && this.ctx.fillText(
      roundPrice(price).toString(),
      Math.trunc((this.sizes.width - this.textMetrics.width) / 2),
      Math.trunc(defaultPosition || this.getPricePosition(
        price,
        this.pricesSettings.minPrice,
        this.pricesSettings.maxPrice
      ) + this.textMetrics.height / 2),
    )
  }
  getCurrentPrice = (y: number) => {
    const { maxPrice, minPrice } = this.pricesSettings
    const scaledHeight = this.sizes.height * this.settings.scaleY
    const clippedHeight = (this.sizes.height - scaledHeight) / 2
    const percentPosition = ((scaledHeight + clippedHeight) - y) * 100 / scaledHeight
    return (percentPosition * (maxPrice - minPrice) / 100) + minPrice
  }
  drawCurrentPrice = (price: number, y: number) => {
    const rectHeight = this.textMetrics.height + 18 // padding vertical 9
    this.ctx!.fillStyle = this.settings.colors!.button
    this.roundedRect(
      this.ctx!,
      0,
      y - rectHeight / 2,
      this.sizes.width,
      rectHeight,
      5,
    )
    this.ctx!.fillStyle = this.settings.colors!.text
    this.ctx!.fillText(
      roundPrice(price).toString(),
      (this.sizes.width - this.textMetrics.width) / 2,
      y,
    )
  }

  renderPrices = () => {
    this.placePriceOnChart(this.pricesSettings.minPrice)
    this.placePriceOnChart(this.pricesSettings.maxPrice)

    const pricesCount = Math.floor(this.sizes.height / (this.textMetrics.height + 40) - 2)
    new Array(pricesCount - 1).fill(null).reduce((prev) => {
      const interval = (this.pricesSettings.maxPrice - this.pricesSettings.minPrice) / pricesCount
      const curr = prev + interval
      this.placePriceOnChart(+roundPrice(curr))
      return curr
    }, this.pricesSettings.minPrice)
  }
  drawChart = () => {
    this.clearCanvas()
    this.renderPrices()
  }
}

export {
  ChartPrices
}
