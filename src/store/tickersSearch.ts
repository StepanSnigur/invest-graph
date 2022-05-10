import { makeAutoObservable, runInAction } from 'mobx'
import { chartApi } from '../api/ChartApi'

export interface ISearchedTicker {
  symbol: string,
  country: string,
  instrument_name: string,
}
class TickersSearch {
  searchInputRef: HTMLInputElement | null = null
  isInputFocused: boolean = false
  searchedTickers: ISearchedTicker[] = []
  isSearching: boolean = false

  constructor() {
    makeAutoObservable(this)
  }

  setFocusOnInput = () => {
    if (this.searchInputRef) {
      this.searchInputRef.focus()
      this.handleInputFocus()
    }
  }
  handleInputBlur = () => {
    this.isInputFocused = false
  }
  handleInputFocus = () => {
    this.isInputFocused = true
  }
  setSearchInputRef = (inputEl: HTMLInputElement) => {
    this.searchInputRef = inputEl
  }

  getTickers = async (inputValue: string) => {
    if (!this.isSearching) {
      this.isSearching = true
      
      const tickers = await chartApi.searchTicker(inputValue)
      runInAction(() => {
        this.searchedTickers = tickers.data
        this.isSearching = false
      })
    }
  }
}

const tickersSearch = new TickersSearch()
export {
  tickersSearch
}
