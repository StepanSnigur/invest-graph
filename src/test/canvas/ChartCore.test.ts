import 'jest-canvas-mock'
import { ChartCore } from '../../canvas/ChartCore'

describe('ChartCore', () => {
  test('Correct initialize library', () => {
    const chartCore = new ChartCore(100, 100, new CanvasRenderingContext2D())
    expect(chartCore).toBeDefined()
  })
})
