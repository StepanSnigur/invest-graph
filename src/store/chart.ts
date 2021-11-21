import { makeAutoObservable } from 'mobx'
import { chartApi } from '../api/ChartApi'

export interface ITickerData {
  datetime: string,
  open: string,
  high: string,
  low: string,
  close: string,
  volume: string,
}
export interface IChartData {
  minPrice: number,
  maxPrice: number,
  currentPrice: number | null,
}

class Chart {
  tickerData: ITickerData[] = []
  chartData: IChartData = {
    minPrice: 0,
    maxPrice: 0,
    currentPrice: null,
  }
  // TODO
  chartSettings = {}

  constructor() {
    makeAutoObservable(this)
  }

  loadChart = async (ticker: string) => {
    try {
      const tickerData = await chartApi.getChart(ticker)
      this.setTickerData(tickerData.values.reverse())
      this.setMinMaxPrice()
    } catch (e) {
      console.log(e)
    }
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

  get pricesRange() {
    return Math.abs(this.chartData.maxPrice - this.chartData.minPrice)
  }
}

const chart = new Chart()
export {
  chart
}
