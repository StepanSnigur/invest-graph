import { makeAutoObservable, runInAction } from 'mobx'
import { chartApi } from '../api/ChartApi'

export interface ITickerData {
  datetime: string,
  open: string,
  high: string,
  low: string,
  close: string,
  volume: string,
}
interface ITickerMeta {
  currency: string,
  exchange: string,
  symbol: string,
  name: string,
  logo: string,
}
export interface IChartData {
  minPrice: number,
  maxPrice: number,
  currentPrice: number | null,
  cursorX: number,
  cursorY: number,
  offsetX: number,
  prevOffsetX: number,
}

class Chart {
  tickerData: ITickerData[] = []
  tickerMeta: ITickerMeta | null = null

  chartData: IChartData = {
    minPrice: 0,
    maxPrice: 0,
    currentPrice: null,
    cursorX: 0,
    cursorY: 0,
    offsetX: 0,
    prevOffsetX: 0,
  }
  focusedCandleIdx: null | number = null
  error: string | false = false
  // TODO
  chartSettings = {
    maxCandlesOnScreenCount: 150
  }

  constructor() {
    makeAutoObservable(this)
  }

  loadChart = async (ticker: string) => {
    try {
      const tickerData = await chartApi.getChart(ticker)
      const tickerInfo = await chartApi.getTickerMeta(ticker)
      this.setTickerMeta({ ...tickerInfo.meta, logo: tickerInfo.url })
      this.setTickerData(tickerData.values.reverse())
      this.setMinMaxPrice()
    } catch (e) {
      this.setError('Не удалось загрузить график')
      console.log(e)
    }
  }
  moveCursor = (x: number, y: number) => {
    this.chartData.cursorX = x
    this.chartData.cursorY = y
  }

  setMinMaxPrice = () => {
    const prices = this.tickerData
      .map(value => [+value.open, +value.close])
      .flat()
      .sort((a, b) => a - b)

    this.chartData = {
      ...this.chartData,
      minPrice: prices[0],
      maxPrice: prices[prices.length - 1]
    }
  }
  setTickerData = (tickerData: ITickerData[]) => {
    this.tickerData = tickerData
  }
  appendCandlesToStart = (candles: ITickerData[]) => {
    this.tickerData = [...candles, ...this.tickerData]
  }
  setTickerMeta = (tickerMeta: ITickerMeta) => {
    this.tickerMeta = tickerMeta
  }
  setError = (error: string) => {
    this.error = error
  }
  setFocusedCandleIdx = (idx: number | null) => {
    runInAction(() => {
      this.focusedCandleIdx = idx
    })
  }

  setOffsetX = (offsetX: number) => {
    this.chartData.offsetX = this.chartData.prevOffsetX + offsetX
  }
  setPrevOffsetX = () => {
    this.chartData.prevOffsetX = this.chartData.offsetX
  }
  // normalize offsetX after pushing elements in the array
  normalizeOffsetX = (shift: number) => {
    this.chartData.offsetX = this.chartData.offsetX - shift
  }

  checkNewData = async (canvasWidth: number) => {
    if (this.chartData.offsetX > 0) {
      const columnWidth = canvasWidth / this.chartSettings.maxCandlesOnScreenCount
      const columnsToGet = Math.ceil(this.chartData.offsetX / columnWidth)

      const newChartCandles = await this.getNewChartCandles(columnsToGet, this.tickerData[0].datetime)
      this.appendCandlesToStart(newChartCandles.values.reverse())

      // TODO move it inside a hook
      const screenShift = columnWidth * columnsToGet
      this.normalizeOffsetX(screenShift)
      this.setPrevOffsetX()
    }
  }
  getNewChartCandles = async (candlesCount: number, endDate: string) => {
    if (!this.tickerMeta?.symbol) throw new Error('Unknown ticker')

    return await chartApi.getNewChartCandles(this.tickerMeta.symbol, candlesCount, endDate)
  }

  get pricesRange() {
    return Math.abs(this.chartData.maxPrice - this.chartData.minPrice)
  }
}

const chart = new Chart()
export {
  chart
}
