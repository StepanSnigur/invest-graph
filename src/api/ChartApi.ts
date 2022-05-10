import { ApiConfig } from './apiConfig'

class ChartApi extends ApiConfig{
  getTickerMeta = async (ticker: string) => {
    return await this.makeRequest(`logo?symbol=${ticker}`)
  }
  getChart = async (ticker: string, count: number = 150, interval: string) => {
    return await this.makeRequest(`time_series?symbol=${ticker}&outputsize=${count}&interval=${interval}`)
  }
  getNewChartCandles = async (ticker: string, candlesCount: number, endDate: string, interval: string) => {
    return await this.makeRequest(
      `time_series?symbol=${ticker}&end_date=${endDate}&outputsize=${candlesCount}&interval=${interval}`
    )
  }
  getTickerIndicators = async (ticker: string, indicators: string[], interval: string) => {
    const indicatorsData = indicators.map(async indicator => {
      return await this.makeRequest(
        `${indicator}?symbol=${ticker}&interval=${interval}`
      )
    })
    const indicatorsValues = await Promise.all(indicatorsData)

    const result: {
      [key: typeof indicators[number]]: number 
    } = {}
    indicators.forEach((indicator, i) => {
      const lastData = indicatorsValues[i].values[0]
      result[indicator]= lastData[indicator]
    })
    
    
    return result
  }
  getTickerStatistics = async (ticker: string) => {
    return await this.makeRequest(
      `statistics?symbol=${ticker}`
    )
  }
  searchTicker = async (ticker: string) => {
    return await this.makeRequest(`symbol_search?symbol=${ticker}&outputsize=7&show_plan=true`)
  }
}

const chartApi = new ChartApi()
export {
  chartApi
}
