import { ApiConfig } from './apiConfig'

class ChartApi extends ApiConfig{
  getTickerMeta = async (ticker: string) => {
    return await this.makeRequest(`logo?symbol=${ticker}`)
  }
  getChart = async (ticker: string, count: number = 150) => {
    return await this.makeRequest(`time_series?symbol=${ticker}&outputsize=${count}&interval=1min`)
  }
}

const chartApi = new ChartApi()
export {
  chartApi
}
