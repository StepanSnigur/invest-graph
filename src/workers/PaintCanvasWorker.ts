import { ISketch, ISketchPoint } from '../store/chartSketches'

interface IPaintData {
  sketches: string,
  minPrice: number,
  maxPrice: number,
  offsetX: number,
  scaleY: number,
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
  
  const drawCurve = (ctx: CanvasRenderingContext2D, height: number, paintData: IPaintData) => {
    JSON.parse(paintData.sketches).forEach((sketch: ISketch) => {
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
  let context: CanvasRenderingContext2D | null = null

  onmessage = function({ data }) {
    if (data.offscreenCanvas) {
      context = data.offscreenCanvas.getContext('2d')
    }
    if (context && data.sketches) {
      context.clearRect(0, 0, context.canvas.width, context.canvas.height)
      drawCurve(context, context.canvas.height, data)
    }
  }
}

let code = paintCanvasWorker.toString()
code = code.substring(code.indexOf("{")+1, code.lastIndexOf("}"))

const blob = new Blob([code], {type: "application/javascript"})
const paintCanvasWorkerScript = URL.createObjectURL(blob)

export {
  paintCanvasWorkerScript
}
