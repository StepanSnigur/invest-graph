import { ISketch, ISketchPoint, IChartDrawing } from '../store/chartSketches'
import { Theme } from '@mui/material'

interface IPaintData {
  sketchesData: string,
  minPrice: number,
  maxPrice: number,
  offsetX: number,
  scaleY: number,
  settings: string,
  chartColors: string,
}
const paintCanvasWorker = () => {
  const drawLines = (ctx: CanvasRenderingContext2D, points: number[]) => {
    ctx.moveTo(points[0], points[1])
    for(let i = 2; i < points.length - 1; i += 2) ctx.lineTo(points[i], points[i+1])
  }
  const getPricePosition = (price: number, minPrice: number, maxPrice: number, height: number, scaleY: number) => {
    const percentPosition = (price - minPrice) * 100 / (maxPrice - minPrice)
    const scaledPosition = (height - (height / 100 * percentPosition)) * scaleY
    const scaledHeight = (height - height * scaleY) / 2
    return scaledPosition + scaledHeight
  }
  const getCurrentPrice = (y: number, height: number, scaleY: number, minPrice: number, maxPrice: number) => {
    const scaledHeight = height * scaleY
    const clippedHeight = (height - scaledHeight) / 2
    const percentPosition = ((scaledHeight + clippedHeight) - y) * 100 / scaledHeight
    return (percentPosition * (maxPrice - minPrice) / 100) + minPrice
  }
  const moveCurvePoints = (points: ISketchPoint[], height: number, paintData: IPaintData) => {
    const { minPrice, maxPrice, offsetX, scaleY } = paintData
    return points.map(point => {
      return {
        ...point,
        x: point.x + offsetX,
        y: getPricePosition(point.y, minPrice, maxPrice, height, scaleY),
      }
    })
  }
  const getCurvePoints = (points: number[], tension = 0.5, isClosed = false, numOfSegments = 16): number[] => {
    let _pts = [], res = [],	// clone array
        x, y,			// our x,y coords
        t1x, t2x, t1y, t2y,	// tension vectors
        c1, c2, c3, c4,		// cardinal points
        st, t, i		// steps based on num. of segments
  
    // clone array so we don't change the original
    //
    _pts = points.slice(0)
  
    // The algorithm require a previous and next point to the actual point array.
    // Check if we will draw closed or open curve.
    // If closed, copy end points to beginning and first points to end
    // If open, duplicate first points to befinning, end points to end
    if (isClosed) {
      _pts.unshift(points[points.length - 1])
      _pts.unshift(points[points.length - 2])
      _pts.unshift(points[points.length - 1])
      _pts.unshift(points[points.length - 2])
      _pts.push(points[0])
      _pts.push(points[1])
    }
    else {
      _pts.unshift(points[1])	//copy 1. point and insert at beginning
      _pts.unshift(points[0])
      _pts.push(points[points.length - 2])	//copy last point and append
      _pts.push(points[points.length - 1])
    }
  
    // 1. loop goes through point array
    // 2. loop goes through each segment between the 2 pts + 1e point before and after
    for (i=2; i < (_pts.length - 4); i+=2) {
      for (t=0; t <= numOfSegments; t++) {
  
        // calc tension vectors
        t1x = (_pts[i+2] - _pts[i-2]) * tension
        t2x = (_pts[i+4] - _pts[i]) * tension
  
        t1y = (_pts[i+3] - _pts[i-1]) * tension
        t2y = (_pts[i+5] - _pts[i+1]) * tension
  
        // calc step
        st = t / numOfSegments
  
        // calc cardinals
        c1 =   2 * Math.pow(st, 3) 	- 3 * Math.pow(st, 2) + 1
        c2 = -(2 * Math.pow(st, 3)) + 3 * Math.pow(st, 2)
        c3 = 	   Math.pow(st, 3)	- 2 * Math.pow(st, 2) + st
        c4 = 	   Math.pow(st, 3)	- 	  Math.pow(st, 2)
  
        // calc x and y cords with common control vectors
        x = c1 * _pts[i]	+ c2 * _pts[i+2] + c3 * t1x + c4 * t2x
        y = c1 * _pts[i+1]	+ c2 * _pts[i+3] + c3 * t1y + c4 * t2y
  
        //store points in array
        res.push(x)
        res.push(y)
      }
    }
  
    return res
  }
  const drawingLibrary = {
    drawLine: function (
      ctx: CanvasRenderingContext2D,
      from: ISketchPoint,
      to: ISketchPoint,
      offsetX: number,
      minPrice: number,
      maxPrice: number,
      height: number,
      scaleY: number,
      chartColors: Theme,
    ) {
      const fromYOffset = getPricePosition(from.y, minPrice, maxPrice, height, scaleY)
      const toYOffset = getPricePosition(to.y, minPrice, maxPrice, height, scaleY)
  
      ctx.beginPath()
      ctx.strokeStyle = chartColors.palette.primary.main
      ctx.setLineDash([])
      ctx.moveTo(from.x + offsetX, fromYOffset)
      ctx.lineTo(to.x + offsetX, toYOffset)
      ctx.stroke()
      ctx.closePath()
    },
    drawMeasureLine: function (
      ctx: CanvasRenderingContext2D,
      from: ISketchPoint,
      to: ISketchPoint,
      offsetX: number,
      minPrice: number,
      maxPrice: number,
      canvasHeight: number,
      scaleY: number,
      chartColors: Theme,
    ) {
      const fromYOffset = getPricePosition(from.y, minPrice, maxPrice, canvasHeight, scaleY)
      const toYOffset = getPricePosition(to.y, minPrice, maxPrice, canvasHeight, scaleY)
      const width = to.x - from.x
      const height = toYOffset - fromYOffset
  
      const startPrice = getCurrentPrice(fromYOffset, canvasHeight, scaleY, minPrice, maxPrice)
      const endPrice = getCurrentPrice(toYOffset, canvasHeight, scaleY, minPrice, maxPrice)
      const percent = Math.abs(startPrice - endPrice) * 100 / Math.max(startPrice, endPrice)
      const stockUp = chartColors.palette.success.main //this.settings.colors.palette.success.main
      const stockDown = chartColors.palette.error.main
      const fillColor = startPrice > endPrice ? stockDown : stockUp
  
  
      ctx.setLineDash([])
      ctx.lineWidth = 3
      ctx.strokeStyle = fillColor
      ctx.fillStyle = fillColor
  
      ctx.globalAlpha = 0.2
      ctx.fillRect(from.x  + offsetX, fromYOffset, width, height)
      ctx.globalAlpha = 1.0
  
      ctx.beginPath() // arrow
      this.drawArrow(
        ctx,
        from.x + offsetX + width / 2,
        fromYOffset,
        from.x + offsetX + width / 2,
        toYOffset,
        5,
        5,
      )
      ctx.closePath()
  
      ctx.font = '16px sans-serif'
      ctx.fillText(
        `${(startPrice > endPrice) ? '-' : '+'}${percent.toFixed(2)}%`,
        from.x + offsetX + width / 2 + 10,
        fromYOffset + height / 2,
        Math.abs(width / 2),
      )
      ctx.fillText(
        `${-(startPrice - endPrice).toFixed(3)}${'$'}`, // TODO
        from.x + offsetX + width / 2 + 10,
        fromYOffset + height / 2 + 20,
        Math.abs(width / 2),
      )
    },
  
    drawArrow: (
      ctx: CanvasRenderingContext2D,
      x0: number,
      y0: number,
      x1: number,
      y1: number,
      arrowWidth: number,
      arrowLength: number,
    ) => {
      const dx=x1-x0
      const dy=y1-y0
      const angle=Math.atan2(dy, dx)
      const length=Math.sqrt(dx * dx + dy * dy)
  
      ctx.translate(x0, y0)
      ctx.rotate(angle)
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(length, 0)
  
      ctx.moveTo(length - arrowLength,-arrowWidth)
      ctx.lineTo(length, 0)
      ctx.lineTo(length - arrowLength,arrowWidth)
  
      ctx.stroke()
      ctx.setTransform(1, 0, 0, 1, 0, 0)
    }
  }
  
  const drawCurve = (ctx: CanvasRenderingContext2D, height: number, paintData: IPaintData) => {
    const colors = JSON.parse(paintData.chartColors)
    const sketchesData = JSON.parse(paintData.sketchesData)

    ctx.strokeStyle = colors.palette.primary.main

    sketchesData.sketches.forEach((sketch: ISketch) => {
      ctx.lineWidth = sketch.lineWidth
      ctx.beginPath()
      const mappedPoints = moveCurvePoints(
        sketch.points,
        height,
        paintData,
      ).map(point => [point.x, point.y]).flat()
      drawLines(ctx, getCurvePoints(mappedPoints))
      ctx.stroke()
    })
  }
  const drawTool = (
    ctx: CanvasRenderingContext2D,
    drawing: IChartDrawing,
    height: number,
    paintData: IPaintData,
  ) => {
    const { minPrice, maxPrice, offsetX, scaleY, chartColors } = paintData
    ctx.lineWidth = drawing.lineWidth
    drawingLibrary[drawing.drawFunction](
      ctx,
      drawing.from,
      drawing.to as ISketchPoint,
      offsetX,
      minPrice,
      maxPrice,
      height,
      scaleY,
      JSON.parse(chartColors)
    )
  }

  let context: CanvasRenderingContext2D | null = null
  onmessage = function({ data }) {
    if (data.offscreenCanvas) {
      context = data.offscreenCanvas.getContext('2d')
    }
    if (context && data.sketchesData) {
      context.clearRect(0, 0, context.canvas.width, context.canvas.height)
      drawCurve(context, context.canvas.height, data)
    }
    if (context && data.toolDrawings) {
      const drawings = JSON.parse(data.toolDrawings)
      drawings.forEach((drawing: IChartDrawing) => {
        if (drawing.to.x !== null && drawing.to.y !== null && context) {
          drawTool(context, drawing, context.canvas.height, data)
        }
      })
    }
  }
}

let code = paintCanvasWorker.toString()
code = code.substring(code.indexOf("{")+1, code.lastIndexOf("}"))

const blob = new Blob([code], { type: "application/javascript" })
const paintCanvasWorkerScript = URL.createObjectURL(blob)

export {
  paintCanvasWorkerScript
}
