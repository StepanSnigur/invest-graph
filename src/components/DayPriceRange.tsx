import React from 'react'
import { observer } from 'mobx-react-lite'
import { chartConnector } from '../store/chartConnector'
import styled from 'styled-components'
import { useTheme, Theme } from '@mui/material'

const DayPriceInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`
const DayPriceText = styled.h6`
  margin: 0;
  margin-bottom: 10px;
  opacity: .8;
`
const DayPriceRangeWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 14px;
  border-radius: 12px;
  background: ${({ theme }: { theme: Theme }) => theme.palette.secondary.main};
  overflow: hidden;
`
const DayPriceRangeCursor = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: ${({ theme }: { theme: Theme }) => theme.palette.text.primary};
  border-radius: 4px;
  z-index: 1;
`

interface IDayPriceRange {
  currentPrice: number,
}
export const DayPriceRange: React.FC<IDayPriceRange> = observer(({ currentPrice }) => {
  const theme = useTheme()
  const minPrice = chartConnector.data.minChartPrice
  const maxPrice = chartConnector.data.maxChartPrice

  const currentPricePosition = (currentPrice - minPrice) * 100 / (maxPrice - minPrice)
  return (
    <div>
      <DayPriceInfo>
        <DayPriceText>{minPrice}</DayPriceText>
        <DayPriceText>Диапазон цены</DayPriceText>
        <DayPriceText>{maxPrice}</DayPriceText>
      </DayPriceInfo>
      <DayPriceRangeWrapper theme={theme}>
        <DayPriceRangeCursor
          style={{
            left: `${currentPricePosition}%`
          }}
          theme={theme}
        />
      </DayPriceRangeWrapper>
    </div>
  )
})
