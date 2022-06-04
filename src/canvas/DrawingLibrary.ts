import { ChartCore } from './ChartCore'
import { chartConnector } from '../store/chartConnector'
import { chart } from '../store/chart'

export type IDrawingFunctions = 'drawLine' | 'drawMeasureLine'
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
  drawMeasureLine = (from: ICoordinates, to: ICoordinates, offsetX: number) => {
    const { minChartPrice, maxChartPrice } = chartConnector.data
    const fromYOffset = this.getPricePosition(from.y, minChartPrice, maxChartPrice)
    const toYOffset = this.getPricePosition(to.y, minChartPrice, maxChartPrice)
    const width = to.x - from.x
    const height = toYOffset - fromYOffset

    const startPrice = this.getCurrentPrice(fromYOffset)
    const endPrice = this.getCurrentPrice(toYOffset)
    const percent = Math.abs(startPrice - endPrice) * 100 / Math.max(startPrice, endPrice)
    const fillColor = (startPrice > endPrice ? this.chartColors?.stockDown : this.chartColors?.stockUp) || '#000'


    this.ctx.setLineDash([])
    this.ctx.lineWidth = 2
    this.ctx.strokeStyle = fillColor
    this.ctx.fillStyle = fillColor

    this.ctx.globalAlpha = 0.2
    this.ctx.fillRect(from.x  + offsetX, fromYOffset, width, height)
    this.ctx.globalAlpha = 1.0

    this.ctx.beginPath() // arrow
    this.drawArrow(
      from.x + offsetX + width / 2,
      fromYOffset,
      from.x + offsetX + width / 2,
      toYOffset,
      5,
      5,
    )
    this.ctx.closePath()

    this.ctx.font = '16px sans-serif'
    this.ctx.fillText(
      `${(startPrice > endPrice) ? '-' : '+'}${percent.toFixed(2)}%`,
      from.x + offsetX + width / 2 + 10,
      fromYOffset + height / 2,
      Math.abs(width / 2),
    )
    this.ctx.fillText(
      `${-(startPrice - endPrice).toFixed(3)}${chart.tickerMeta?.currency}`,
      from.x + offsetX + width / 2 + 10,
      fromYOffset + height / 2 + 20,
      Math.abs(width / 2),
    )
  }

  getCurrentPrice = (y: number) => {
    const { maxChartPrice, minChartPrice } = chartConnector.data
    const scaledHeight = this.sizes.height * this.settings.scaleY
    const clippedHeight = (this.sizes.height - scaledHeight) / 2
    const percentPosition = ((scaledHeight + clippedHeight) - y) * 100 / scaledHeight
    return (percentPosition * (maxChartPrice - minChartPrice) / 100) + minChartPrice
  }

  drawArrow = (x0: number, y0: number, x1: number, y1: number, arrowWidth: number, arrowLength: number) => {
    const dx=x1-x0
    const dy=y1-y0
    const angle=Math.atan2(dy, dx)
    const length=Math.sqrt(dx * dx + dy * dy)

    this.ctx.translate(x0, y0)
    this.ctx.rotate(angle)
    this.ctx.beginPath()
    this.ctx.moveTo(0, 0)
    this.ctx.lineTo(length, 0)

    this.ctx.moveTo(length - arrowLength,-arrowWidth)
    this.ctx.lineTo(length, 0)
    this.ctx.lineTo(length - arrowLength,arrowWidth)

    this.ctx.stroke()
    this.ctx.setTransform(1, 0, 0, 1, 0, 0)
  }
}

export {
  DrawingLibrary
}
