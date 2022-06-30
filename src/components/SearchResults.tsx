import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { tickersSearch, ISearchedTicker } from '../store/tickersSearch'
import { useTheme, Theme } from '@mui/material'
import styled, { keyframes } from 'styled-components'
import historyIcon from '../assets/images/history-icon.png'
import { tickerQueriesSaver } from '../utils/tickerQueriesSaver'
import { sliceLongString } from '../utils/sliceLongString'

import { Preloader } from '../components/Preloader'

const zoomAnimation = keyframes`
  from {
    transform: scale(0);
  }
  to {
    transform: scale(100);
  }
`

const HideLayout = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  left: 0;
  top: 0;
  z-index: 99;

  &:before {
    content: '';
    position: absolute;
    width: 100px;
    height: 100px;
    left: 50%;
    transform: translateX(-50%);
    top: 6%;
    background: #000;
    opacity: .4;
    border-radius: 50%;
    animation: ${zoomAnimation} 2s forwards;
  }
`
const SearchResultsWrapper = styled.div`
  position: absolute;
  top: 6%;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  padding: 10px;
  border-radius: 8px;
  background: ${({ theme }: { theme: Theme }) => theme.palette.secondary.main};
  z-index: 999;
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
  color: ${(props: SearchResultProps) => props.theme.palette.text.primary};
  text-align: left;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;

  span:last-child {
    color: ${(props: SearchResultProps) => props.theme.palette.text.secondary};
    font-size: 11px;
    transition: .3s;
  }

  &:hover {
    background: ${(props: SearchResultProps) => props.theme.palette.secondary.main};

    span:last-child {
      color: ${(props: SearchResultProps) => props.theme.palette.text.primary};
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
  background: ${({ theme }: { theme: Theme }) => theme.palette.text.primary};
  margin: 5px 0;
`

interface ITickerButton {
  ticker: ISearchedTicker,
  onTickerClick: (ticker: ISearchedTicker) => void,
  isFromStorage?: boolean,
}
const TickerButton: React.FC<ITickerButton> = ({ ticker, onTickerClick, isFromStorage = false }) => {
  const theme = useTheme()

  return (
    <SearchResult
      theme={theme}
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

type SearchResultProps = { theme: Theme } & { isFromStorage?: boolean }
interface ISearchResults {
  isVisible: boolean,
}
const SearchResults: React.FC<ISearchResults> = observer(({ isVisible }) => {
  const [lastSearches, setLastSearches] = useState<ISearchedTicker[]>([])
  const theme = useTheme()
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
    <HideLayout onClick={tickersSearch.handleInputBlur}>
      <SearchResultsWrapper theme={theme}>
        {tickersSearch.isSearching
          ? <Preloader size={24} marginVertical={15} />
          : tickersSearch.searchedTickers.map((ticker, i) => <TickerButton ticker={ticker} key={i} onTickerClick={handleTickerClick} />)}

        {lastSearches.length && (tickersSearch.searchedTickers.length || tickersSearch.isSearching)
          ? <ResultsDivider theme={theme} />
          : null}

        {lastSearches.map((ticker, i) => <TickerButton ticker={ticker} key={i} onTickerClick={handleTickerClick} isFromStorage={true} />)}
      </SearchResultsWrapper>
    </HideLayout>
  )
})

export {
  SearchResults
}
