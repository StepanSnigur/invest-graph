import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { chart } from '../store/chart'
import styled from 'styled-components'
import { ThemeContext, IAppTheme } from '../context/ThemeContext'

import { FavouriteButton } from './FavouriteButton'

const ChartSidebarWrapper = styled.div`
  width: 20%;
  border: 2px solid ${(props: IAppTheme) => props.theme.lightButton};
  border-radius: 8px;
  color: ${(props: IAppTheme) => props.theme.text};
  box-sizing: border-box;
  padding: 25px 15px;
`
const TickerLogoWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`
const TickerLogo = styled.img`
  width: 52px;
  height: 52px;
  border-radius: 12px;
  margin-right: 12px;
`
const TickerName = styled.h2`
  font-size: 36px;
  font-weight: 500;
  margin: 0;
`
const TickerTag = styled.span`
  color: ${(props: IAppTheme) => props.theme.text};
  background: ${(props: IAppTheme) => props.theme.button};
  opacity: .6;
  font-size: 14px;
  font-weight: 400;
  border-radius: 6px;
  padding: 5px;
  margin-left: 9px;
  margin-right: auto;
`
const TickerSymbol = styled.span`
  font-size: 16px;
`
const PriceSection = styled.div`
  margin-top: 40px;
  margin-bottom: 12px;
  height: 40px;
  display: flex;
  align-items: center;
`
const LastTickerPrice = styled.h3`
  font-size: 32px;
  font-weight: 500;
  margin: 0;
`
const PriceDelta = styled.span`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  margin-left: 12px;
  padding: 0 12px;
  font-size: 18px;
  font-weight: 500;
`
const CurrentCandleInfo = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 12px;
`

export const ChartSidebar = observer(() => {
  const { colors } = useContext(ThemeContext)

  const addFavouriteTicker = () => {
    console.log('favourite')
  }

  const { tickerData, tickerMeta, focusedCandleIdx } = chart
  if (!tickerData.length || !tickerMeta) {
    return <h2>loading</h2>
  }

  const lastPriceIdx = tickerData.length - 1
  const oldPrice = +tickerData[0].open
  const lastPrice = +tickerData[lastPriceIdx].close

  const currentCandle = tickerData[focusedCandleIdx ?? lastPriceIdx]
  const priceDelta = Math.abs(lastPrice - oldPrice) / lastPrice * 100
  const isGoingUp = lastPrice > oldPrice
  return (
    <ChartSidebarWrapper theme={colors}>
      <div>
        <TickerLogoWrapper>
          <TickerLogo src={tickerMeta.logo} alt={tickerMeta.symbol} />
          <TickerName>{tickerMeta.name}</TickerName>
          <TickerTag theme={colors}>{tickerMeta.symbol}</TickerTag>
          <FavouriteButton
            width={32}
            height={32}
            isChecked={false}
            onChange={addFavouriteTicker}
          />
        </TickerLogoWrapper>
        <TickerSymbol>{tickerMeta.symbol} / {tickerMeta.exchange}</TickerSymbol>

        <PriceSection>
          <LastTickerPrice>
            {tickerData[tickerData.length - 1]?.close} {tickerMeta.currency}
          </LastTickerPrice>
          <PriceDelta
            style={{
              background: isGoingUp ? colors.stockUp : colors.stockDown
            }}
          >{isGoingUp ? '+' : '-'}{priceDelta.toFixed(2)}%</PriceDelta>
        </PriceSection>

        <CurrentCandleInfo>
          <span>МАКС {currentCandle?.high}</span>
          <span>МИН {currentCandle?.low}</span>
          <span>ОТКР {currentCandle?.open}</span>
          <span>ЗАКР {currentCandle?.close}</span>
        </CurrentCandleInfo>
      </div>
    </ChartSidebarWrapper>
  )
})
