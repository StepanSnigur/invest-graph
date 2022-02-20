import React, { useContext } from 'react'
import styled from 'styled-components'
import { IAppTheme, ThemeContext } from '../context/ThemeContext'

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
  background: ${(props: IAppTheme) => props.theme.button};
  overflow: hidden;
`
const DayPriceRangeCursor = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: ${(props: IAppTheme) => props.theme.text};
  border-radius: 4px;
  z-index: 1;
`

interface IDayPriceRange {
  minPrice: number,
  maxPrice: number,
  currentPrice: number,
}
export const DayPriceRange: React.FC<IDayPriceRange> = ({ minPrice, maxPrice, currentPrice }) => {
  const { colors } = useContext(ThemeContext)

  const currentPricePosition = (currentPrice - minPrice) * 100 / (maxPrice - minPrice)
  return (
    <div>
      <DayPriceInfo>
        <DayPriceText>{minPrice}</DayPriceText>
        <DayPriceText>Диапазон цены</DayPriceText>
        <DayPriceText>{maxPrice}</DayPriceText>
      </DayPriceInfo>
      <DayPriceRangeWrapper theme={colors}>
        <DayPriceRangeCursor
          style={{
            left: `${currentPricePosition}%`
          }}
          theme={colors}
        />
      </DayPriceRangeWrapper>
    </div>
  )
}
