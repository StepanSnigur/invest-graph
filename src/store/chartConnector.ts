import { makeAutoObservable, runInAction } from 'mobx'

class ChartConnector {
  data = {
    minChartPrice: 0,
    maxChartPrice: 0,
  }

  constructor() {
    makeAutoObservable(this)
  }

  setMinMaxPrices = (minChartPrice: number, maxChartPrice: number) => {
    runInAction(() => {
      this.data = {
        minChartPrice,
        maxChartPrice,
      }
    })
  }
}

const chartConnector = new ChartConnector()
export {
  chartConnector
}
