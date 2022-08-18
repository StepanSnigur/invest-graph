import { makeAutoObservable, runInAction, observe } from 'mobx'
import { chartApi } from '../api/ChartApi'
import { webSocketApi } from '../api/webSocketApi'
import { settingsSaver } from '../utils/settingsSaver'
import { convertUnixDate, getUnixDate, getTimestampsDiff, IConvertedTimestampsDiff } from '../utils/unixDateConverter'

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
  currentPrice: number | null,
  cursorX: number,
  cursorY: number,
  offsetX: number,
  prevOffsetX: number,
  drawingsOffsetX: number,
  prevDrawingsOffsetX: number,
}
interface IChartIndicators {
  [key: string]: number | null,
}
interface ITickerStatistics {
  valuations_metrics: {
    market_capitalization: number,
    forward_pe: number,
    peg_ratio: number,
  },
  dividends_and_splits: {
    dividend_date: string,
    trailing_annual_dividend_rate: number,
  }
}
export interface IChartSettings {
  maxCandlesOnScreenCount: number,
  scaleY: number,
  interval: keyof IConvertedTimestampsDiff,
  autoUpdate: boolean,
}
interface ICanvasElementData {
  width: number,
}
interface IMarketState {
  name: string,
  code: string,
  country: string,
  is_market_open: boolean,
  time_after_open: string,
  time_to_open: string,
  time_to_close: string,
}
interface ISocketData {
  event: string,
  symbol: string,
  currency: string,
  exchange: string,
  type: string,
  timestamp: number,
  price: number,
  day_volume: number,
}

class Chart {
  tickerData: ITickerData[] = []
  tickerMeta: ITickerMeta | null = null
  tickerIndicators: IChartIndicators = {
    macd: null,
    rsi: null,
    adx: null,
  }
  tickerStatistics: ITickerStatistics | null = null
  marketState: IMarketState | null = null

  chartData: IChartData = {
    currentPrice: null,
    cursorX: 0,
    cursorY: 0,
    offsetX: 0,
    prevOffsetX: 0,
    drawingsOffsetX: 0,
    prevDrawingsOffsetX: 0,
  }
  focusedCandleIdx: null | number = null
  error: string | false = false
  alertMessage: string | null = null
  
  chartSettings: IChartSettings = {
    maxCandlesOnScreenCount: 150,
    scaleY: 0.9,
    interval: '1min',
    autoUpdate: true,
  }
  canvasElementData: ICanvasElementData = {
    width: 0,
  }

  constructor() {
    makeAutoObservable(this)

    const settings = settingsSaver.checkDefaultSettings()
    this.chartSettings = settings
  }

  setDefaultData = () => {
    this.tickerData = []
    this.tickerMeta = null
    this.tickerIndicators = {
      macd: null,
      rsi: null,
      adx: null,
    }
  }
  loadChart = async (ticker: string) => {
    this.setDefaultData()
    const { maxCandlesOnScreenCount, interval, autoUpdate } = this.chartSettings
    try {
      const tickerData = await chartApi.getChart(ticker, maxCandlesOnScreenCount, interval)
      const tickerInfo = await chartApi.getTickerMeta(ticker)
      const tickerIndicators = await chartApi.getTickerIndicators(ticker, Object.keys(this.tickerIndicators), interval)
      const tickerStatistics = await chartApi.getTickerStatistics(ticker)

      const micCode = tickerData.meta.mic_code
      const marketState: IMarketState[] = await chartApi.getMarketState(micCode)
      this.setMarketState(marketState[0])

      this.setTickerMeta({ ...tickerInfo.meta, logo: tickerInfo.url, currency: tickerData.meta.currency})
      this.setTickerData(tickerData.values.reverse())
      this.setTickerIndicators(tickerIndicators)
      this.setTickerStatistics(tickerStatistics.statistics)

      if (autoUpdate) {
        this.subscribeToUpdates(ticker)
      }
    } catch (e) {
      this.setError('Не удалось загрузить график')
      if (autoUpdate) {
        this.unsubscribeFromUpdates()
      }
    }
  }

  // websockets
  subscribeToUpdates = (ticker: string) => {
    try {
      const handleSocketMessage = (event: MessageEvent) => {
        const data = JSON.parse(event.data)
        if (data.event === 'price') {
          this.handleSocketMessage(JSON.parse(event.data))
        }
      }

      webSocketApi.openConnection(ticker, handleSocketMessage)
    } catch (e) {
      this.showAlertMessage('Автообновление отключено')
      this.chartSettings.autoUpdate = false
      this.unsubscribeFromUpdates()
    }
  }
  unsubscribeFromUpdates = () => {
    webSocketApi.closeConnection()
  }
  handleSocketMessage = (data: ISocketData) => {
    this.addBarToChart(data.price?.toString(), data.timestamp, data.day_volume?.toString())
  }
  addBarToChart = (price: string, timestamp: number, volume: string) => {
    const datetime = convertUnixDate(timestamp)
    const lastBar = this.tickerData.at(-1)
    const lastDate = lastBar?.datetime
    const unixLastDate = getUnixDate(lastDate || '')

    const { interval } = this.chartSettings
    const timestampsDiff = timestamp - unixLastDate
    const convertedTimestampsDiff = getTimestampsDiff(timestampsDiff)
    const isUpdateNeeded = convertedTimestampsDiff[interval]

    if (isUpdateNeeded) {
      const bar: ITickerData = {
        datetime,
        open: lastBar?.close || price,
        high: price,
        low: price,
        close: price,
        volume,
      }
      this.tickerData.push(bar)

      const columnWidth = this.canvasElementData.width / this.chartSettings.maxCandlesOnScreenCount
      this.setOffsetX(-columnWidth)
      this.setPrevOffsetX()
      this.setPrevDrawingsOffsetX()
    }
  }

  moveCursor = (x: number, y: number) => {
    this.chartData.cursorX = x
    this.chartData.cursorY = y
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
  setTickerIndicators = (data: IChartIndicators) => {
    this.tickerIndicators = data
  }
  setTickerStatistics = (data: ITickerStatistics) => {
    this.tickerStatistics = data
  }
  setMarketState = (marketState: IMarketState) => {
    this.marketState = marketState
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
    this.chartData.drawingsOffsetX = this.chartData.prevDrawingsOffsetX + offsetX
  }
  setPrevOffsetX = () => {
    this.chartData.prevOffsetX = this.chartData.offsetX
  }
  setPrevDrawingsOffsetX = () => {
    this.chartData.prevDrawingsOffsetX = this.chartData.drawingsOffsetX
  }
  // normalize offsetX after pushing elements in the array
  normalizeOffsetX = (shift: number) => {
    this.chartData.offsetX = this.chartData.offsetX - shift
  }

  checkNewData = async () => {
    try {
      if (this.chartData.offsetX > 0) {
        const columnWidth = this.canvasElementData.width / this.chartSettings.maxCandlesOnScreenCount
        const columnsToGet = Math.ceil(this.chartData.offsetX / columnWidth)

        const newChartCandles = await this.getNewChartCandles(columnsToGet, this.tickerData[0].datetime)
        this.appendCandlesToStart(newChartCandles.values.reverse())

        const screenShift = columnWidth * columnsToGet
        this.normalizeOffsetX(screenShift)
        this.setPrevOffsetX()
        this.setPrevDrawingsOffsetX()
      }
    } catch (e) {
      this.showAlertMessage('Ошибка при загрузке данных')
    }
  }
  getNewChartCandles = async (candlesCount: number, endDate: string) => {
    if (!this.tickerMeta?.symbol) throw new Error('Unknown ticker')
    const { interval } = this.chartSettings

    return await chartApi.getNewChartCandles(this.tickerMeta.symbol, candlesCount, endDate, interval)
  }

  setMaxCandlesOnScreenCount = (count: number) => {
    this.chartSettings.maxCandlesOnScreenCount += count
  }
  setYScale = (scaleY: number) => {
    const newScale = this.chartSettings.scaleY + scaleY
    if (newScale > 0.2 && newScale < 5) {
      this.chartSettings.scaleY = newScale
    }
  }
  setInterval = (interval: keyof IConvertedTimestampsDiff) => {
    if (interval !== this.chartSettings.interval) {
      this.chartSettings.interval = interval
    }
  }
  changeIsAutoUpdate = () => {
    this.chartSettings.autoUpdate = !this.chartSettings.autoUpdate
  }
  setCanvasElementWidth = (width: number) => {
    this.canvasElementData.width = width
  }

  showAlertMessage = (message: string, timeout: number = 3000) => {
    this.alertMessage = message

    setTimeout(() => {
      runInAction(() => {
        this.alertMessage = null
      })
    }, timeout)
  }
}

const chart = new Chart()

observe(chart.chartSettings, (change) => {
  if (change.type === 'update') {
    settingsSaver.changeField(change.name.toString(), change.newValue)
    
    // handle autoupdate change
    if (chart.tickerMeta?.symbol) {
      if (chart.chartSettings.autoUpdate) {
        chart.subscribeToUpdates(chart.tickerMeta.symbol)
      } else {
        chart.unsubscribeFromUpdates()
      }
    }
  }
})

export {
  chart
}
