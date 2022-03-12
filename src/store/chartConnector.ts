import { makeAutoObservable, runInAction } from 'mobx'

class ChartConnector {
  data = {
    minChartPrice: 0,
    maxChartPrice: 0,
  }
  settings = {
    scaleY: 0.9,
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

  setYScale = (scaleY: number) => {
    const newScale = this.settings.scaleY + scaleY
    if (newScale > 0.2 && newScale < 5) {
      this.settings.scaleY = newScale
    }
  }
}

const chartConnector = new ChartConnector()
export {
  chartConnector
}
