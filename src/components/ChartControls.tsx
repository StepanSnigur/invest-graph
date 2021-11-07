import React, { useContext } from 'react'
import styled from 'styled-components'
import { ThemeContext, IAppTheme } from '../context/ThemeContext'

import { DropDown } from './DropDown'

const ChartControlsWrapper = styled.div`
  height: 4%;
  display: flex;
  align-items: center;
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

export const ChartControls = () => {
  const themeContext = useContext(ThemeContext)

  const testOptions = [
    { name: 'test1', onPress: (val: string) => console.log(val) },
    { name: 'test2', onPress: (val: string) => console.log(val) },
    { name: 'test2', onPress: (val: string) => console.log(val) },
    { name: 'test4', onPress: (val: string) => console.log(val) },
  ]

  return (
    <ChartControlsWrapper>
      <ControlButton theme={themeContext.colors}>test</ControlButton>
      <ControlButton theme={themeContext.colors}>test</ControlButton>
      <ControlButton theme={themeContext.colors}>test</ControlButton>
      <DropDown title="test" options={testOptions} showIcon={true} />
    </ChartControlsWrapper>
  )
}
