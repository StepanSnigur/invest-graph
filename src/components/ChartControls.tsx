import React, { useContext } from 'react'
import styled from 'styled-components'
import { ThemeContext, IAppTheme } from '../context/ThemeContext'
import { ChartIntervalButton } from './ChartIntervalButton'

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
  background: ${(props: IAppTheme) => props.theme.button};
  color: ${(props: IAppTheme) => props.theme.text};
  cursor: pointer;
`
const ChartInput = styled.input`
  height: 80%;
  background: ${(props: IAppTheme) => props.theme.button};
  color: ${(props: IAppTheme) => props.theme.text};
  font-size: 16px;
  border: none;
  border-radius: 8px;
  padding: 0 10px;
`

export const ChartControls = () => {
  const { colors } = useContext(ThemeContext)

  return (
    <ChartControlsWrapper>
      <ButtonsBlock>
        <ControlButton theme={colors}>test</ControlButton>
        <ControlButton theme={colors}>test</ControlButton>
        <ControlButton theme={colors}>test</ControlButton>
      </ButtonsBlock>
      <ChartInput placeholder="Введите тикер" theme={colors} />
      <ChartIntervalButton />
    </ChartControlsWrapper>
  )
}
