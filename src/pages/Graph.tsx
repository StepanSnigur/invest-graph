import React from 'react'
import styled from 'styled-components'

import { Sidebar } from '../components/Sidebar'
import { ChartControls } from '../components/ChartControls'
import { Chart } from '../components/Chart'
import { ChartSidebar } from '../components/ChartSidebar'
import { ChartSubData } from '../components/ChartSubData'

import appLogo from '../assets/images/logo.png'
import homeIcon from '../assets/images/home-icon.png'
import searchIcon from '../assets/images/search-icon.png'
import shareIcon from '../assets/images/share-icon.png'
import watchlistIcon from '../assets/images/watchlist-icon.png'
import pencilIcon from '../assets/images/pencil-icon.png'
import measureIcon from '../assets/images/measure-icon.png'
import binIcon from '../assets/images/bin-icon.png'
import patternIcon from '../assets/images/pattern-icon.png'
import textIcon from '../assets/images/text-icon.png'
import sunIcon from '../assets/images/sun-icon.png'
import moonIcon from '../assets/images/moon-icon.png'
import settingsIcon from '../assets/images/settings-icon.png'

const ChartPage = styled.div`
  display: flex;
`
const GraphWrapper = styled.div`
  height: 100vh;
  width: 97%;
`
const ChartContentWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  height: 80%;
`

interface IGraph {
  id: string
}
export const Graph: React.FC<IGraph> = ({ id }) => {
  const sidebarButtons = [
    {background: 'inherit', buttons: [
      { background: '#7739FE', icon: appLogo, onClick: () => console.log('logo') },
      { background: '#7739FE', icon: homeIcon, onClick: () => console.log('home') },
    ]},
    {
      background: '#432a48',
      buttons: [
        { background: '#f4378b', icon: searchIcon, onClick: () => console.log('search') },
        { background: '#f4378b', icon: shareIcon, onClick: () => console.log('share') },
        { background: '#f4378b', icon: watchlistIcon, onClick: () => console.log('watchlist') },
      ],
    },
    {
      background: '#332757',
      buttons: [
        { background: '#7739FE', icon: pencilIcon, onClick: () => console.log('draw') },
        { background: '#7739FE', icon: measureIcon, onClick: () => console.log('measure') },
        { background: '#7739FE', icon: patternIcon, onClick: () => console.log('trading pattern') },
        { background: '#7739FE', icon: textIcon, onClick: () => console.log('text') },
        { background: '#7739FE', icon: binIcon, onClick: () => console.log('remove') },
      ],
    },
    {background: 'inherit', buttons: [
      { background: '#7739FE', icon: moonIcon, onClick: () => console.log('theme') },
      { background: '#7739FE', icon: settingsIcon, onClick: () => console.log('settings') },
    ]},
  ]

  return (
    <ChartPage>
      <Sidebar buttonsBlocks={sidebarButtons} />
      <GraphWrapper>
        <ChartControls />
        <ChartContentWrapper>
          <ChartSidebar />
          <Chart ticker={id} />
        </ChartContentWrapper>
        <ChartSubData />
      </GraphWrapper>
    </ChartPage>
  )
}
