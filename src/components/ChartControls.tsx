import React, { useContext, useEffect, useState, useRef } from 'react'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { ThemeContext, IAppTheme } from '../context/ThemeContext'
import { tickersSearch } from '../store/tickersSearch'
import { ChartIntervalButton } from './ChartIntervalButton'
import { SearchResults } from './SearchResults'

const ChartControlsWrapper = styled.div`
  position: relative;
  height: 6%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px;
`
const ButtonsBlock = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
`
const ControlButton = styled.button`
  height: 80%;
  margin: 0 2px;
  padding: 0 10px;
  border: none;
  border-radius: 8px;
  background: ${(props: IAppTheme) => props.theme.button};
  color: ${(props: IAppTheme) => props.theme.text};
  cursor: pointer;
`
const ChartInput = styled.input`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  height: 80%;
  background: ${(props: IAppTheme) => props.theme.button};
  color: ${(props: IAppTheme) => props.theme.text};
  font-size: 16px;
  border: none;
  border-radius: 8px;
  padding: 0 10px;
`

export const ChartControls = observer(() => {
  const [searchInputValue, setSearchInputValue] = useState('')
  const { colors } = useContext(ThemeContext)
  const searchInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    const listener = (e: any) => {
      if (e.target.getAttribute('title') !== 'поиск') { // hide search results if click not on search button
        tickersSearch.handleInputBlur()
      }
    }

    document.addEventListener('click', listener)
    return () => {
      document.removeEventListener('click', listener)
    }
  }, [])
  useEffect(() => {
    if (searchInputRef.current) {
      tickersSearch.setSearchInputRef(searchInputRef.current)
    }
  }, [searchInputRef])

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInputValue(e.target.value)
    tickersSearch.getTickers(e.target.value)
  }

  return (
    <ChartControlsWrapper>
      <ButtonsBlock>
        <ControlButton theme={colors}>test</ControlButton>
        <ControlButton theme={colors}>test</ControlButton>
        <ControlButton theme={colors}>test</ControlButton>
      </ButtonsBlock>
      <ChartInput
        placeholder="Введите тикер"
        value={searchInputValue}
        theme={colors}
        ref={searchInputRef}
        onFocus={tickersSearch.handleInputFocus}
        onChange={handleSearchInputChange}
        title="поиск"
      />
      <SearchResults isVisible={tickersSearch.isInputFocused} />
      <ChartIntervalButton />
    </ChartControlsWrapper>
  )
})
