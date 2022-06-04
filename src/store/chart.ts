import { makeAutoObservable, runInAction, observe } from 'mobx'
import { chartApi } from '../api/ChartApi'
import { ICoordinates, IDrawingFunctions } from '../canvas/DrawingLibrary'
import { settingsSaver } from '../utils/settingsSaver'

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
  interval: string,
}
export interface IChartDrawing {
  from: {
    x: number,
    y: number,
  },
  to: {
    x: number | null,
    y: number | null,
  },
  drawFunction: IDrawingFunctions,
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
  }
  chartDrawings: IChartDrawing[] = []
  isInDrawingMode: IDrawingFunctions | false = false
  drawIndex: number | null = null

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
    const { maxCandlesOnScreenCount, interval } = this.chartSettings
    try {
      const tickerData = await chartApi.getChart(ticker, maxCandlesOnScreenCount, interval)
      const tickerInfo = await chartApi.getTickerMeta(ticker)
      const tickerIndicators = await chartApi.getTickerIndicators(ticker, Object.keys(this.tickerIndicators), interval)
      const tickerStatistics = await chartApi.getTickerStatistics(ticker)

      this.setTickerMeta({ ...tickerInfo.meta, logo: tickerInfo.url, currency: tickerData.meta.currency})
      this.setTickerData(tickerData.values.reverse())
      this.setTickerIndicators(tickerIndicators)
      this.setTickerStatistics(tickerStatistics.statistics)
    } catch (e) {
      this.setError('Не удалось загрузить график')
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

  checkNewData = async (canvasWidth: number) => {
    try {
      if (this.chartData.offsetX > 0) {
        const columnWidth = canvasWidth / this.chartSettings.maxCandlesOnScreenCount
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

  setIsInDrawingMode = (isInDrawingMode: IDrawingFunctions | false) => {
    if (isInDrawingMode === this.isInDrawingMode) {
      this.isInDrawingMode = false
    } else {
      this.isInDrawingMode = isInDrawingMode
    }
  }
  addChartDrawing = (drawing: IChartDrawing) => {
    this.chartDrawings.push(drawing)
  }
  changeLastDrawingPosition = (to: ICoordinates) => {
    this.chartDrawings[this.chartDrawings.length - 1].to = to
  }
  setDrawIndex = (drawIndex: number | null) => {
    this.drawIndex = drawIndex
  }
  removeAllDrawings = () => {
    this.chartDrawings = []
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
  setInterval = (interval: string) => {
    if (interval !== this.chartSettings.interval) {
      this.chartSettings.interval = interval
    }
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
  }
})

export {
  chart
}
