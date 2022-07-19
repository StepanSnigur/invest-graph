import React, { useEffect, useState, useRef } from 'react'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { useTheme, Theme } from '@mui/material'
import { tickersSearch } from '../store/tickersSearch'
import { ChartIntervalButton } from './ChartIntervalButton'
import { SearchResults } from './SearchResults'
import Switch from '@mui/material/Switch'

const ChartControlsWrapper = styled.div`
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
  background: ${({ theme }: { theme: Theme }) => theme.palette.secondary.main};
  color: ${({ theme }: { theme: Theme }) => theme.palette.text.primary};
  cursor: pointer;
`
const ChartInput = styled.input`
  position: absolute;
  left: 50%;
  height: 5%;
  transform: translateX(-50%);
  background: ${({ theme }: { theme: Theme }) => theme.palette.secondary.main};
  color: ${({ theme }: { theme: Theme }) => theme.palette.text.primary};
  font-size: 16px;
  border: none;
  border-radius: 8px;
  padding: 0 10px;
  z-index: 999;

  ::placeholder {
    color: ${({ theme }: { theme: Theme }) => theme.palette.text.primary};
  }
`

export const ChartControls = observer(() => {
  const [searchInputValue, setSearchInputValue] = useState('')
  const [autoUpdate, setAutoUpdate] = useState(false)
  const theme = useTheme()
  const searchInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (searchInputRef.current) {
      tickersSearch.setSearchInputRef(searchInputRef.current)
    }
  }, [searchInputRef])

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInputValue(e.target.value)
    tickersSearch.getTickers(e.target.value)
  }
  const handleAutoUpdateSwitch = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAutoUpdate(prevState => !prevState)
    e.preventDefault()
  }

  return (
    <ChartControlsWrapper>
      <ButtonsBlock>
        <ControlButton theme={theme} onClick={handleAutoUpdateSwitch}>
          <Switch checked={autoUpdate} />
          автообновление
        </ControlButton>
        <ControlButton theme={theme}>создать оповещение</ControlButton>
        <ControlButton theme={theme}>изменить вид графика</ControlButton>
      </ButtonsBlock>
      <ChartInput
        placeholder="Введите тикер"
        value={searchInputValue}
        theme={theme}
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
