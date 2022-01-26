import React, { useContext, useEffect } from 'react'
import { autorun } from 'mobx'
import { observer } from 'mobx-react-lite'
import { chart } from '../store/chart'
import styled from 'styled-components'
import { ThemeContext, IAppTheme } from '../context/ThemeContext'

const ChartSidebarWrapper = styled.div`
  width: 20%;
  border: 2px solid ${(props: IAppTheme) => props.theme.lightButton};
  border-radius: 8px;
  color: ${(props: IAppTheme) => props.theme.text};
  box-sizing: border-box;
  padding: 12px;
`
const TickerLogoWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`
const TickerLogo = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 12px;
  margin-right: 12px;
`
const TickerName = styled.h2`
  font-size: 42px;
  font-weight: bold;
  margin: 0;
`
const TickerSymbol = styled.span`
  font-size: 16px;
`
const LastTickerPrice = styled.h3`
  font-size: 36px;
  font-weight: normal;
  margin-bottom: 0;
`
const CurrentCandleInfo = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 12px;
`

export const ChartSidebar = observer(() => {
  const { colors } = useContext(ThemeContext)

  useEffect(() => {
    autorun(() => {
    })
  }, [])

  const currentCandle = chart.tickerData[chart.focusedCandleIdx ?? chart.tickerData.length - 1]
  return (
    <ChartSidebarWrapper theme={colors}>
      {chart.tickerMeta
        ? <div>
          <TickerLogoWrapper>
            <TickerLogo src={chart.tickerMeta.logo} alt={chart.tickerMeta.symbol} />
            <TickerName>{chart.tickerMeta.name}</TickerName>
          </TickerLogoWrapper>
          <TickerSymbol>{chart.tickerMeta.symbol} / {chart.tickerMeta.exchange}</TickerSymbol>
          <LastTickerPrice>
            {chart.tickerData[chart.tickerData.length - 1]?.close} {chart.tickerMeta.currency}
          </LastTickerPrice>
          <CurrentCandleInfo>
            <span>МАКС {currentCandle?.high}</span>
            <span>МИН {currentCandle?.low}</span>
            <span>ОТКР {currentCandle?.open}</span>
            <span>ЗАКР {currentCandle?.close}</span>
          </CurrentCandleInfo>
        </div>
        : <h2>loading</h2>}
    </ChartSidebarWrapper>
  )
})
