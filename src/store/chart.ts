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
  }
  focusedCandleIdx: null | number = null
  error: string | false = false
  // TODO
  chartSettings = {}

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

  get pricesRange() {
    return Math.abs(this.chartData.maxPrice - this.chartData.minPrice)
  }
}

const chart = new Chart()
export {
  chart
}
