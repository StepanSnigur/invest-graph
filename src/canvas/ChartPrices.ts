import { ChartCore } from './ChartCore'
import { Theme } from '@mui/material'
import { roundPrice } from '../utils/roundPrice'

interface IChartPricesSettings {
  minPrice: number,
  maxPrice: number,
}
class ChartPrices extends ChartCore {
  private pricesSettings: IChartPricesSettings = {
    minPrice: 0,
    maxPrice: 0,
  }
  private textMetrics = {
    width: 0,
    height: 0,
  }

  constructor(
    width: number,
    height: number,
    colors: Theme,
    ctx: CanvasRenderingContext2D,
  ) {
    super(width, height, ctx)
    this.setChartColors(colors)
  }

  public setMinMaxPrices = (minPrice: number, maxPrice: number) => {
    this.pricesSettings.minPrice = minPrice
    this.pricesSettings.maxPrice = maxPrice
    this.setTextMetrics()
  }
  private setTextMetrics = () => {
    const textMeasures = this.ctx.measureText(roundPrice(this.pricesSettings.minPrice).toString())
    this.textMetrics = {
      width: textMeasures?.width,
      height: textMeasures?.fontBoundingBoxAscent + textMeasures?.fontBoundingBoxDescent,
    }
  }
  private placePriceOnChart = (price: number, defaultPosition?: number) => {
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
  public getCurrentPrice = (y: number) => {
    const { maxPrice, minPrice } = this.pricesSettings
    const scaledHeight = this.sizes.height * this.settings.scaleY
    const clippedHeight = (this.sizes.height - scaledHeight) / 2
    const percentPosition = ((scaledHeight + clippedHeight) - y) * 100 / scaledHeight
    return (percentPosition * (maxPrice - minPrice) / 100) + minPrice
  }
  public drawCurrentPrice = (price: number, y: number) => {
    const rectHeight = this.textMetrics.height + 18 // padding vertical 9
    this.ctx.fillStyle = this.settings.colors!.palette.primary.main
    this.roundedRect(
      this.ctx,
      0,
      y - rectHeight / 2,
      this.sizes.width,
      rectHeight,
      5,
    )
    this.ctx.fillStyle = this.settings.colors!.palette.text.primary
    this.ctx.fillText(
      roundPrice(price).toString(),
      (this.sizes.width - this.textMetrics.width) / 2,
      y,
    )
  }

  private renderPrices = () => {
    this.placePriceOnChart(this.pricesSettings.minPrice)
    this.placePriceOnChart(this.pricesSettings.maxPrice)

    const pricesCount = Math.floor(this.sizes.height * this.settings.scaleY / (this.textMetrics.height * this.settings.scaleY + 40) - 2)
    new Array(pricesCount - 1).fill(null).reduce((prev) => {
      const interval = (this.pricesSettings.maxPrice - this.pricesSettings.minPrice) / pricesCount
      const curr = prev + interval
      this.placePriceOnChart(+roundPrice(curr))
      return curr
    }, this.pricesSettings.minPrice)
  }
  public drawChart = () => {
    this.clearCanvas()
    this.renderPrices()
  }
}

export {
  ChartPrices
}
