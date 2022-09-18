import { makeAutoObservable } from 'mobx'
import { chart } from '../store/chart'

export type IDrawingFunctions = 'drawLine' | 'drawMeasureLine'
export interface ISketchPoint {
  x: number,
  y: number,
}
export interface ISketch {
  points: ISketchPoint[],
  lineWidth: number,
}
export interface IChartDrawing {
  from: {
    x: number,
    y: number,
  },
  to: {
    x: number | null,
    y: number | null,
  },
  drawFunction: IDrawingFunctions,
  lineWidth: number,
}

class ChartSketches {
  mouseDown: boolean = false
  sketches: ISketch[] = []
  isDrawing: boolean = false

  toolDrawings: IChartDrawing[] = []
  toolDrawIndex: number | null = null
  isDrawingTools: IDrawingFunctions | false = false

  constructor() {
    makeAutoObservable(this)
  }

  changeDrawingMode = () => {
    this.isDrawing = !this.isDrawing
  }
  setMouseDown = (isMouseDown: boolean) => {
    this.mouseDown = isMouseDown
  }

  // sketches
  startDrawing = () => {
    this.sketches.push({
      points: [],
      lineWidth: chart.drawSettings.brushLineWidth,
    })
  }
  addPointToDraw = (x: number, y: number) => {
    const updatedSketches = [...this.sketches]
    updatedSketches[updatedSketches.length - 1].points.push({ x, y })
    this.sketches = updatedSketches
  }

  // tools
  setToolsDrawingMode = (drawingMode: IDrawingFunctions | false) => {
    if (drawingMode === this.isDrawingTools) {
      this.isDrawingTools = false
    } else {
      this.isDrawingTools = drawingMode
    }
  }
  addChartTool = (drawing: IChartDrawing) => {
    this.toolDrawings.push(drawing)
  }
  changeLastToolDrawingPosition = (to: ISketchPoint) => {
    this.toolDrawings[this.toolDrawings.length - 1].to = to
  }
  setToolDrawIndex = (drawIndex: number | null) => {
    this.toolDrawIndex = drawIndex
  }
  
  removeAllDrawings = () => {
    this.toolDrawings = []
    this.sketches = []
  }
}

const chartSketches = new ChartSketches()
export {
  chartSketches
}
