import { ApiConfig } from './apiConfig'

class ChartApi extends ApiConfig{
  getTickerMeta = async (ticker: string) => {
    return await this.makeRequest(`logo?symbol=${ticker}`)
  }
  getChart = async (ticker: string, count: number = 150) => {
    return await this.makeRequest(`time_series?symbol=${ticker}&outputsize=${count}&interval=1min`)
  }
  getNewChartCandles = async (ticker: string, candlesCount: number, endDate: string) => {
    return await this.makeRequest(
      `time_series?symbol=${ticker}&end_date=${endDate}&outputsize=${candlesCount}&interval=1min`
    )
  }
  getTickerIndicators = async (ticker: string, indicators: string[]) => {
    const indicatorsData = indicators.map(async indicator => {
      return await this.makeRequest(
        `${indicator}?symbol=${ticker}&interval=1min`
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
}

const chartApi = new ChartApi()
export {
  chartApi
}
