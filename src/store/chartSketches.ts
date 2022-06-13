import { makeAutoObservable } from 'mobx'

export interface ISketchPoint {
  x: number,
  y: number,
}
export interface ISketch {
  points: ISketchPoint[],
}
class ChartSketches {
  sketches: ISketch[] = []
  isDrawing: boolean = false
  mouseDown: boolean = false

  constructor() {
    makeAutoObservable(this)
  }

  changeDrawingMode = () => {
    this.isDrawing = !this.isDrawing
  }
  setMouseDown = (isMouseDown: boolean) => {
    this.mouseDown = isMouseDown
  }
  startDrawing = () => {
    this.sketches.push({
      points: []
    })
  }
  addPointToDraw = (x: number, y: number) => {
    const updatedSketches = [...this.sketches]
    updatedSketches[updatedSketches.length - 1].points.push({ x, y })
    this.sketches = updatedSketches
  }
}

const chartSketches = new ChartSketches()
export {
  chartSketches
}
