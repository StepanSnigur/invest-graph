interface ICoordinates {
  x: number,
  y: number,
}
class DrawingLibrary {
  ctx: CanvasRenderingContext2D

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx
  }

  drawLine = (from: ICoordinates, to: ICoordinates) => {

  }
}

export {
  DrawingLibrary
}
