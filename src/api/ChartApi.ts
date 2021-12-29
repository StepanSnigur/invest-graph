import { ApiConfig } from './apiConfig'

class ChartApi extends ApiConfig{
  getChart = async (ticker: string, count: number = 50) => {
    return await this.makeRequest(`time_series?symbol=${ticker}&outputsize=${count}&interval=1min`)
  }
}

const chartApi = new ChartApi()
export {
  chartApi
}
