import { ChartCore } from './ChartCore'
import { chartConnector } from '../store/chartConnector'

export type IDrawingFunctions = 'drawLine'
export interface ICoordinates {
  x: number,
  y: number, // price
}
class DrawingLibrary extends ChartCore {
  startDrawing = (drawFunction: string, from: ICoordinates) => {
    const drawing = {
      from,
      to: {},
      fn: drawFunction,
    }

    return (to: ICoordinates, isOver: boolean) => {
      drawing.to = to
    }
  }

  drawLine = (from: ICoordinates, to: ICoordinates, offsetX: number) => {
    const { minChartPrice, maxChartPrice } = chartConnector.data
    const fromYOffset = this.getPricePosition(from.y, minChartPrice, maxChartPrice)
    const toYOffset = this.getPricePosition(to.y, minChartPrice, maxChartPrice)

    this.ctx.beginPath()
    this.ctx.strokeStyle = this.chartColors?.button || '#000'
    this.ctx.setLineDash([])
    this.ctx.lineWidth = 3
    this.ctx.moveTo(from.x + offsetX, fromYOffset)
    this.ctx.lineTo(to.x + offsetX, toYOffset)
    this.ctx.stroke()
    this.ctx.closePath()
  }

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
