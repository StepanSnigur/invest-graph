import React, { useContext, useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { tickersSearch } from '../store/tickersSearch'
import { ThemeContext, IAppTheme } from '../context/ThemeContext'
import styled from 'styled-components'
import historyIcon from '../assets/images/history-icon.png'
import { ISearchedTicker } from '../store/tickersSearch'
import { tickerQueriesSaver } from '../utils/tickerQueriesSaver'
import { sliceLongString } from '../utils/sliceLongString'

import { Preloader } from '../components/Preloader'

const SearchResultsWrapper = styled.div`
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  padding: 10px;
  border-radius: 8px;
  background: ${(props: IAppTheme) => props.theme.button};
  z-index: 99;
`
const SearchResult = styled.button<SearchResultProps>`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  border: none;
  border-radius: 8px;
  padding: 7px 24px 7px 12px;
  background: none;
  color: ${(props: SearchResultProps) => props.theme.text};
  text-align: left;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;

  span:last-child {
    color: ${(props: SearchResultProps) => props.theme.darkText};
    font-size: 11px;
    transition: .3s;
  }

  &:hover {
    background: ${(props: SearchResultProps) => props.theme.secondaryBackground};

    span:last-child {
      color: ${(props: SearchResultProps) => props.theme.text};
    }
  }
  &:before {
    content: ${(props: SearchResultProps) => props.isFromStorage ? `url(${historyIcon})` : ''};
    position: absolute;
    top: 50%;
    transform: translateY(-50%) scale(.5);
    right: -5px;
  }
`
const ResultsDivider = styled.div`
  width: 100%;
  height: 1px;
  background: ${(props: IAppTheme) => props.theme.text};
  margin: 5px 0;
`

interface ITickerButton {
  ticker: ISearchedTicker,
  onTickerClick: (ticker: ISearchedTicker) => void,
  isFromStorage?: boolean,
}
const TickerButton: React.FC<ITickerButton> = ({ ticker, onTickerClick, isFromStorage = false }) => {
  const { colors } = useContext(ThemeContext)

  return (
    <SearchResult
      theme={colors}
      isFromStorage={isFromStorage}
      onClick={() => onTickerClick(ticker)}
      title={ticker.instrument_name}
    >
      <span>{ticker.symbol}</span>
      <span>
        {sliceLongString(ticker.instrument_name, 16)}<br />
        {sliceLongString(ticker.country, 16)}
      </span>
    </SearchResult>
  )
}

type SearchResultProps = IAppTheme & { isFromStorage?: boolean }
interface ISearchResults {
  isVisible: boolean,
}
const SearchResults: React.FC<ISearchResults> = observer(({ isVisible }) => {
  const [lastSearches, setLastSearches] = useState<ISearchedTicker[]>([])
  const { colors } = useContext(ThemeContext)
  const history = useHistory()

  useEffect(() => { // get recent ticker searches
    setLastSearches(tickerQueriesSaver.getLastSearches())
  }, [])

  const handleTickerClick = (ticker: ISearchedTicker) => {
    const lastSearches = tickerQueriesSaver.saveLastTicker(ticker)
    setLastSearches(lastSearches)
    history.push(ticker.symbol)
  }

  if (!isVisible) return null
  return (
    <SearchResultsWrapper theme={colors}>
      {tickersSearch.isSearching
        ? <Preloader size={24} marginVertical={15} />
        : tickersSearch.searchedTickers.map((ticker, i) => <TickerButton ticker={ticker} key={i} onTickerClick={handleTickerClick} />)}

      {lastSearches.length && (tickersSearch.searchedTickers.length || tickersSearch.isSearching)
        ? <ResultsDivider theme={colors} />
        : null}

      {lastSearches.map((ticker, i) => <TickerButton ticker={ticker} key={i} onTickerClick={handleTickerClick} isFromStorage={true} />)}
    </SearchResultsWrapper>
  )
})

export {
  SearchResults
}
