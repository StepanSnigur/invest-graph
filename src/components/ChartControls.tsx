import React from 'react'
import styled from 'styled-components'

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
  background: #303b51;
  color: #dcdccc;
  cursor: pointer;
`

export const ChartControls = () => {
  const testOptions = [
    { name: 'test1', onPress: (val: string) => console.log(val) },
    { name: 'test2', onPress: (val: string) => console.log(val) },
    { name: 'test2', onPress: (val: string) => console.log(val) },
    { name: 'test4', onPress: (val: string) => console.log(val) },
  ]

  return (
    <ChartControlsWrapper>
      <ControlButton>test</ControlButton>
      <ControlButton>test</ControlButton>
      <ControlButton>test</ControlButton>
      <DropDown title="test" options={testOptions} showIcon={true} />
    </ChartControlsWrapper>
  )
}
