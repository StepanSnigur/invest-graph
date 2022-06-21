import { ChartCore } from './ChartCore'
import { chartConnector } from '../store/chartConnector'

export interface ICoordinates {
  x: number,
  y: number, // price
}
class DrawingLibrary extends ChartCore {
  getCurrentPrice = (y: number) => {
    const { maxChartPrice, minChartPrice } = chartConnector.data
    const scaledHeight = this.sizes.height * this.settings.scaleY
    const clippedHeight = (this.sizes.height - scaledHeight) / 2
    const percentPosition = ((scaledHeight + clippedHeight) - y) * 100 / scaledHeight
    return (percentPosition * (maxChartPrice - minChartPrice) / 100) + minChartPrice
  }
}

export {
  DrawingLibrary
}
