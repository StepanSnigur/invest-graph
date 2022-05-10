import { ISearchedTicker } from '../store/tickersSearch'

class TickerQueriesSaver {
  private nameInStorage = 'lastTickerSearches'
  private maxLastSearchesCount = 5

  public getLastSearches = () => {
    const lastSearchesFromStore = localStorage.getItem(this.nameInStorage)
    if (lastSearchesFromStore) {
      return JSON.parse(lastSearchesFromStore)
    }
    return []
  }
  public saveLastTicker = (ticker: ISearchedTicker) => {
    const lastSearches = this.getLastSearches()

    if (lastSearches.find((searchedTicker: ISearchedTicker) => searchedTicker.symbol === ticker.symbol)) {
      const tickerIdx = lastSearches.findIndex((s: ISearchedTicker) => s.symbol === ticker.symbol)
      const updatedLastSearches = [ticker, ...lastSearches.slice(0, tickerIdx), ...lastSearches.slice(tickerIdx + 1)]

      this.saveToStorage(updatedLastSearches)
      return updatedLastSearches
    }

    if (lastSearches.length >= this.maxLastSearchesCount) {
      lastSearches.unshift(ticker)
      lastSearches.pop()
    } else {
      lastSearches.unshift(ticker)
    }
    this.saveToStorage(lastSearches)

    return lastSearches
  }

  private saveToStorage = (data: string[]) => {
    const jsonData = JSON.stringify(data)
    localStorage.setItem(this.nameInStorage, jsonData)
  }
}

const tickerQueriesSaver = new TickerQueriesSaver()
export {
  tickerQueriesSaver,
}
