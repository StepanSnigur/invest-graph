import { chart, ITickerData } from '../store/chart'
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
  drawChart = (data: ITickerData[], minPrice: number) => {
    if (!this.settings.colors) throw new Error('You must provide colors to chart')

    this.clearCanvas()
    const canvasHeight = this.sizes.height
    const columnWidth = this.sizes.width / data.length
    const gapBetweenColumns = columnWidth * 0.15 // 15% of column width
    const { stockUp, stockDown } = this.settings.colors

    data.forEach((data, i) => {
      const { open, close } = data
      const [date, time] = data.datetime.split(' ')
      this.ctx!.fillStyle = isStockGoingUp(+open, +close) ? stockUp : stockDown

      const openValuePosition = (+open - minPrice) * 100 / chart.pricesRange
      const closeValuePosition = (+close - minPrice) * 100 / chart.pricesRange

      const topIndent = canvasHeight - (canvasHeight / 100 * openValuePosition)
      const bottomIndent = canvasHeight - (canvasHeight / 100 * closeValuePosition)

      this.ctx!.fillRect(
        i * columnWidth,
        bottomIndent,
        columnWidth - gapBetweenColumns,
        topIndent - bottomIndent,
      )
      if (i % 3 === 0) {
        this.ctx!.fillText(time, i * columnWidth, canvasHeight + 15)
      }
    })
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
