import { IThemeColors } from '../context/ThemeContext'

export interface IChartSettings {
  colors: IThemeColors | null,
  scaleY: number,
  datePadding: number,
  focusedCandleBorderWidth: number,
  maxCandlesOnScreenCount: number,
  gridLinesCount: number,
}
class ChartCore {
  sizes = {
    width: 0,
    height: 0,
  }
  ctx: CanvasRenderingContext2D | null = null
  settings: IChartSettings = {
    colors: null,
    scaleY: 0.9,
    datePadding: 5,
    focusedCandleBorderWidth: 1,
    maxCandlesOnScreenCount: 150,
    gridLinesCount: 10,
  }

  constructor(width: number, height: number, ctx: CanvasRenderingContext2D) {
    this.sizes = {
      width,
      height,
    }

    if (!ctx) throw new Error('You must provide canvas context to chart library')
    this.ctx = ctx
  }

  setChartColors = (colors: IThemeColors) => {
    this.settings.colors = colors
  }
  clearCanvas = () => {
    this.ctx && this.ctx.clearRect(0, 0, this.sizes.width, this.sizes.height)
  }

  getPricePosition = (price: number, minPrice: number, maxPrice: number) => {
    const percentPosition = (price - minPrice) * 100 / (maxPrice - minPrice)
    const scaledPosition = (this.sizes.height - (this.sizes.height / 100 * percentPosition)) * this.settings.scaleY
    const scaledHeight = (this.sizes.height - this.sizes.height * this.settings.scaleY) / 2
    return scaledPosition + scaledHeight
  }
}

export {
  ChartCore
}
