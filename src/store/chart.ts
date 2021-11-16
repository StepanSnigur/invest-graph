import { makeAutoObservable } from 'mobx'

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

const mockData = {
  AAPL: {
    values: [
      {
        datetime: "2021-11-03 12:39:00",
        open: "150.58000",
        high: "150.62000",
        low: "150.57210",
        close: "150.60880",
        volume: "34622"
      },
      {
        datetime: "2021-11-03 12:38:00",
        open: "150.56500",
        high: "150.60280",
        low: "150.56000",
        close: "150.58000",
        volume: "63156"
      },
      {
        datetime: "2021-11-03 12:37:00",
        open: "150.60001",
        high: "150.60500",
        low: "150.53000",
        close: "150.57001",
        volume: "93940"
      },
      {
        datetime: "2021-11-03 12:36:00",
        open: "150.64000",
        high: "150.69000",
        low: "150.60001",
        close: "150.60001",
        volume: "64330"
      },
      {
        datetime: "2021-11-03 12:35:00",
        open: "150.64999",
        high: "150.67030",
        low: "150.63000",
        close: "150.64999",
        volume: "43881"
      },
      {
        datetime: "2021-11-03 12:34:00",
        open: "150.67999",
        high: "150.69000",
        low: "150.64000",
        close: "150.64999",
        volume: "48926"
      },
      {
        datetime: "2021-11-03 12:33:00",
        open: "150.64999",
        high: "150.67999",
        low: "150.64000",
        close: "150.67000",
        volume: "44225"
      },
      {
        datetime: "2021-11-03 12:32:00",
        open: "150.67250",
        high: "151.69000",
        low: "150.64200",
        close: "151.65790",
        volume: "50184"
      },
      {
        datetime: "2021-11-03 12:31:00",
        open: "150.64500",
        high: "150.70000",
        low: "150.62000",
        close: "150.67000",
        volume: "82583"
      },
      {
        datetime: "2021-11-03 12:30:00",
        open: "150.57001",
        high: "150.64799",
        low: "150.56500",
        close: "150.64799",
        volume: "54420"
      },
      {
        datetime: "2021-11-03 12:29:00",
        open: "150.59000",
        high: "150.60001",
        low: "150.55000",
        close: "150.56000",
        volume: "64300"
      },
      {
        datetime: "2021-11-03 12:28:00",
        open: "150.57500",
        high: "150.60001",
        low: "150.55499",
        close: "150.59000",
        volume: "51104"
      },
      {
        datetime: "2021-11-03 12:27:00",
        open: "150.56000",
        high: "150.59720",
        low: "150.55000",
        close: "150.57010",
        volume: "54289"
      },
      {
        datetime: "2021-11-03 12:26:00",
        open: "150.59000",
        high: "150.59000",
        low: "150.52000",
        close: "150.56000",
        volume: "70676"
      },
      {
        datetime: "2021-11-03 12:25:00",
        open: "150.58501",
        high: "150.60989",
        low: "150.56000",
        close: "150.58270",
        volume: "52545"
      },
      {
        datetime: "2021-11-03 12:24:00",
        open: "150.61501",
        high: "150.61600",
        low: "150.55000",
        close: "150.58501",
        volume: "64198"
      },
      {
        datetime: "2021-11-03 12:23:00",
        open: "150.59000",
        high: "150.63000",
        low: "150.57001",
        close: "150.61031",
        volume: "74345"
      },
      {
        datetime: "2021-11-03 12:22:00",
        open: "150.56000",
        high: "150.60500",
        low: "150.55251",
        close: "150.58949",
        volume: "47756"
      },
      {
        datetime: "2021-11-03 12:21:00",
        open: "150.59000",
        high: "150.60001",
        low: "150.54089",
        close: "150.55499",
        volume: "61943"
      },
      {
        datetime: "2021-11-03 12:20:00",
        open: "150.53500",
        high: "150.60001",
        low: "150.53500",
        close: "150.59500",
        volume: "58276"
      },
      {
        datetime: "2021-11-03 12:19:00",
        open: "150.60831",
        high: "150.60831",
        low: "150.53000",
        close: "150.53500",
        volume: "59368"
      },
      {
        datetime: "2021-11-03 12:18:00",
        open: "150.53999",
        high: "150.61000",
        low: "150.52499",
        close: "150.60500",
        volume: "59873"
      },
      {
        datetime: "2021-11-03 12:17:00",
        open: "150.57500",
        high: "150.60989",
        low: "150.52499",
        close: "150.53081",
        volume: "93569"
      },
      {
        datetime: "2021-11-03 12:16:00",
        open: "150.56000",
        high: "150.60001",
        low: "150.55000",
        close: "150.57570",
        volume: "136375"
      },
      {
        datetime: "2021-11-03 12:15:00",
        open: "150.53819",
        high: "150.56000",
        low: "150.52049",
        close: "150.55260",
        volume: "42004"
      },
      {
        datetime: "2021-11-03 12:14:00",
        open: "150.54500",
        high: "150.57500",
        low: "150.50500",
        close: "150.53101",
        volume: "56097"
      },
      {
        datetime: "2021-11-03 12:13:00",
        open: "150.50999",
        high: "150.55000",
        low: "150.50250",
        close: "150.54500",
        volume: "67764"
      }
    ],
    status: "ok"
  },
}
class Chart {
  tickerData: ITickerData[] = []
  chartData: IChartData = {
    minPrice: 0,
    maxPrice: 0,
    currentPrice: null,
  }

  constructor() {
    makeAutoObservable(this)
  }

  loadChart = async (ticker: string) => {
    try {
      this.setTickerData([...mockData.AAPL.values].reverse())
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
