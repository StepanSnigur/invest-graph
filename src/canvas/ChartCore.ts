import { IThemeColors } from '../context/ThemeContext'
import { CanvasUtils } from './CanvasUtils'

export interface IChartSettings {
  colors: IThemeColors | null,
  scaleY: number,
  datePadding: number,
  focusedCandleBorderWidth: number,
  maxCandlesOnScreenCount: number,
  gridLinesCount: number,
}
class ChartCore extends CanvasUtils {
  protected sizes = {
    width: 0,
    height: 0,
  }
  protected settings: IChartSettings = {
    colors: null,
    scaleY: 0.9,
    datePadding: 5,
    focusedCandleBorderWidth: 1,
    maxCandlesOnScreenCount: 150,
    gridLinesCount: 10,
  }

  constructor(width: number, height: number, protected ctx: CanvasRenderingContext2D) {
    super()
    this.sizes = {
      width,
      height,
    }

    if (!ctx) throw new Error('You must provide canvas context to chart library')
    this.ctx = ctx
  }

  public setChartColors = (colors: IThemeColors) => {
    this.settings.colors = colors
  }
  protected clearCanvas = () => {
    this.ctx.clearRect(0, 0, this.sizes.width, this.sizes.height)
  }

  protected getPricePosition = (price: number, minPrice: number, maxPrice: number) => {
    const percentPosition = (price - minPrice) * 100 / (maxPrice - minPrice)
    const scaledPosition = (this.sizes.height - (this.sizes.height / 100 * percentPosition)) * this.settings.scaleY
    const scaledHeight = (this.sizes.height - this.sizes.height * this.settings.scaleY) / 2
    return scaledPosition + scaledHeight
  }

  public get chartColors() {
    return this.settings.colors
  }
}

export {
  ChartCore
}
