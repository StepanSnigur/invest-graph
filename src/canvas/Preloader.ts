interface IPreloaderOptions {
  radius: number,
  width: number,
  x: number,
  y: number,
  color: string,
}
class Preloader {
  private options: IPreloaderOptions
  private angle = 0
  private reverse = false

  constructor(private ctx: CanvasRenderingContext2D, options: IPreloaderOptions) {
    this.ctx = ctx
    this.options = options
  }

  private update = () => {
    this.angle += .1

    if (this.angle > Math.PI * 2) {
      this.angle = 0
      this.reverse = !this.reverse
    }
  }
  public draw = () => {
    const { x, y, radius, width, color } = this.options

    this.update()
    this.ctx.clearRect(x - radius * 2, y - radius * 2, radius * 4, radius * 4)
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
