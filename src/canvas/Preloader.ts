interface IPreloaderOptions {
  radius: number,
  width: number,
  x: number,
  y: number,
  color: string,
}
class Preloader {
  ctx: CanvasRenderingContext2D | null
  options: IPreloaderOptions
  angle = 0
  reverse = false

  constructor(ctx: CanvasRenderingContext2D | null, options: IPreloaderOptions) {
    this.ctx = ctx
    this.options = options
  }

  update = () => {
    this.angle += .1

    if (this.angle > Math.PI * 2) {
      this.angle = 0
      this.reverse = !this.reverse
    }
  }
  draw = () => {
    if (!this.ctx) return
    const { x, y, radius, width, color } = this.options

    this.update()
    this.ctx.clearRect(x - 100, y - 100, 300, 300)
    this.ctx.beginPath()
    this.ctx.strokeStyle = color
    this.reverse
      ? this.ctx.arc(x, y, radius, this.angle, Math.PI * 2)
      : this.ctx.arc(x, y, radius, 0, this.angle)
    this.ctx.lineWidth = width
    this.ctx.stroke()
  }
}

export {
  Preloader
}
