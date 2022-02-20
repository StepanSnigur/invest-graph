import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { chart } from '../store/chart'
import { chartConnector } from '../store/chartConnector'
import styled, { keyframes } from 'styled-components'
import { ThemeContext, IAppTheme } from '../context/ThemeContext'

import { FavouriteButton } from './FavouriteButton'
import { DayPriceRange } from './DayPriceRange'

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
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 1px solid #808080;
`

export const ChartSidebar = observer(() => {
  const { colors } = useContext(ThemeContext)

  const addFavouriteTicker = () => {
    console.log('favourite')
  }

  const { tickerData, tickerMeta, focusedCandleIdx } = chart
  if (!tickerData.length || !tickerMeta) {
    return <ChartSidebarSkeleton />
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

        <DayPriceRange
          minPrice={chartConnector.data.minChartPrice}
          maxPrice={chartConnector.data.maxChartPrice}
          currentPrice={lastPrice}
        />
      </div>
    </ChartSidebarWrapper>
  )
})

const skeletonAnimation = keyframes`
  from {
    left: -100%;
  }
  to {
    left: 200%;
  }
`
const TickerLogoSkeleton = styled.div`
  position: relative;
  width: 52px;
  height: 52px;
  border-radius: 12px;
  margin-right: 12px;
  background: #808080;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    left: -100%;
    top: -100%;
    width: 1%;
    height: 300%;
    transform: rotate(45deg);
    background: #A9A9A9;
    box-shadow: 0 0 5px 5px #A9A9A9;
    animation: ${skeletonAnimation} 1s ease-in-out infinite;
  }
`
const TickerNameSkeleton = styled.div`
  position: relative;
  width: 50%;
  height: 32px;
  border-radius: 12px;
  background: #808080;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    left: -100%;
    top: -100%;
    width: 2%;
    height: 300%;
    transform: rotate(45deg);
    background: #A9A9A9;
    box-shadow: 0 0 15px 25px #A9A9A9;
    animation: ${skeletonAnimation} 1s ease-in-out infinite;
  }
`
const CurrentCandleInfoSkeleton = styled.div`
  position: relative;
  width: 100%;
  height: 100px;
  border-radius: 12px;
  background: #808080;
  margin-bottom: 15px;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    left: -100%;
    top: -100%;
    width: 2%;
    height: 300%;
    transform: rotate(45deg);
    background: #A9A9A9;
    box-shadow: 0 0 15px 25px #A9A9A9;
    animation: ${skeletonAnimation} 1s ease-in-out infinite;
  }
`
const ChartSidebarSkeleton: React.FC = () => {
  const { colors } = useContext(ThemeContext)

  return (
    <ChartSidebarWrapper theme={colors}>
      <div>
        <TickerLogoWrapper>
          <TickerLogoSkeleton />
          <TickerNameSkeleton />
        </TickerLogoWrapper>
        <CurrentCandleInfoSkeleton />
        <CurrentCandleInfoSkeleton />
      </div>
    </ChartSidebarWrapper>
  )
}
