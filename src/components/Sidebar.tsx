import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { useTheme } from '@mui/material'
import { ThemeContext } from '../context/ThemeContext'
import styled from 'styled-components'
import { tickersSearch } from '../store/tickersSearch'
import { chartSketches } from '../store/chartSketches'
import { chart } from '../store/chart'

import appLogo from '../assets/images/logo.png'
import homeIcon from '../assets/images/home-icon.png'
import searchIcon from '../assets/images/search-icon.png'
import shareIcon from '../assets/images/share-icon.png'
import watchListIcon from '../assets/images/watchList-icon.png'
import pencilIcon from '../assets/images/pencil-icon.png'
import paintIcon from '../assets/images/paint-icon.png'
import measureIcon from '../assets/images/measure-icon.png'
import binIcon from '../assets/images/bin-icon.png'
import patternIcon from '../assets/images/pattern-icon.png'
import textIcon from '../assets/images/text-icon.png'
import sunIcon from '../assets/images/sun-icon.png'
import moonIcon from '../assets/images/moon-icon.png'
import settingsIcon from '../assets/images/settings-icon.png'
import { SidebarButton as SidebarButtonComponent } from './SidebarButton'
import { IDrawSettings } from '../store/chart'

const SidebarWrapper = styled.div`
  width: 5%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`
const ButtonsBlock = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  background: ${(props: { background: string }) => props.background};
  padding: 5px;
  border-radius: calc(2vw / 2);
`
const SidebarButton = styled.button`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background: inherit;
  width: 2.7vw;
  height: 2.7vw;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  margin-bottom: 5px;
  transition: .3s;
  
  &:hover {
    background: ${(props: { background: string }) => props.background};
  }
  &:last-child {
    margin-bottom: 0;
  }
`
const ButtonIcon = styled.img`
  width: 24px;
  height: 24px;
`
const ActiveIndicator = styled.div`
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background:#000;
`

interface ISidebarButton {
  background: string,
  icon: string,
  onClick: () => void,
  onContextMenu?: () => void,
  title?: string,
  isActive?: boolean,
  paramName?: string,
}
export const Sidebar = observer(() => {
  const theme = useTheme()
  const themeContext = useContext(ThemeContext)

  const sidebarButtons = [
    {background: 'inherit', buttons: [
      { background: '#7739FE', icon: appLogo, onClick: () => console.log('logo') },
      { background: '#7739FE', icon: homeIcon, onClick: () => console.log('home') },
    ]},
    {
      background: '#432a48',
      buttons: [
        { background: '#f4378b', icon: searchIcon, onClick: tickersSearch.setFocusOnInput, title: 'поиск', isActive: tickersSearch.isInputFocused },
        { background: '#f4378b', icon: shareIcon, onClick: () => console.log('share') },
        { background: '#f4378b', icon: watchListIcon, onClick: () => console.log('watchList') },
      ],
    },
    {
      background: '#332757',
      buttons: [
        {
          background: '#7739FE',
          icon: pencilIcon,
          onClick: () => chartSketches.setToolsDrawingMode('drawLine'),
          onContextMenu: () => console.log('pencil'),
          isActive: chartSketches.isDrawingTools === 'drawLine',
          paramName: 'pencil',
        },
        {
          background: '#7739FE',
          icon: paintIcon,
          onClick: () => chartSketches.changeDrawingMode(),
          onContextMenu: () => console.log('brush'),
          isActive: chartSketches.isDrawing,
          paramName: 'brush',
        },
        { background: '#7739FE', icon: measureIcon, onClick: () => chartSketches.setToolsDrawingMode('drawMeasureLine'), isActive: chartSketches.isDrawingTools === 'drawMeasureLine' },
        { background: '#7739FE', icon: patternIcon, onClick: () => console.log('trading pattern') },
        { background: '#7739FE', icon: textIcon, onClick: () => console.log('text') },
        { background: '#7739FE', icon: binIcon, onClick: chartSketches.removeAllDrawings },
      ],
    },
    {background: 'inherit', buttons: [
      {
        background: '#7739FE',
        icon: theme.palette.mode === 'dark' ? moonIcon : sunIcon,
        onClick: themeContext.toggleColorMode,
      },
      { background: '#7739FE', icon: settingsIcon, onClick: () => console.log('settings') },
    ]},
  ]

  const handleOpenContextMenu = (e: React.MouseEvent, contextMenuCallback?: () => void) => {
    e.preventDefault()
    contextMenuCallback && contextMenuCallback()
  }
  const changeDrawSettings = (name: keyof IDrawSettings, newValue: any) => {
    chart.changeDrawSettings(name, newValue)
  }
  const getDefaultDrawSettings = (paramName: string) => {
    const params = Object.keys(chart.drawSettings).filter((name) => name.includes(paramName))
    const settings: any = {}
    params.forEach(param => {
      settings[param.slice(paramName.length)] = chart.drawSettings[param as keyof IDrawSettings]
    })
    return settings
  }

  return (
    <SidebarWrapper>
      {sidebarButtons.map((buttonBlock, i) => <ButtonsBlock background={buttonBlock.background} key={i}>
        {buttonBlock.buttons.map((button: ISidebarButton, j) => !button.onContextMenu ? <SidebarButton
          background={button.background}
          onClick={button.onClick}
          onContextMenu={(e: React.MouseEvent) => handleOpenContextMenu(e, button.onContextMenu)}
          key={j}
        >
          <ButtonIcon src={button.icon} alt="button"/>
          {button.isActive ? <ActiveIndicator /> : null}
        </SidebarButton> : <SidebarButtonComponent
          key={j}
          background={button.background}
          icon={button.icon}
          onClick={button.onClick}
          onContextMenu={button.onContextMenu}
          isActive={button.isActive}
          onParamChange={(name: string, newValue: any) => changeDrawSettings(
            (button.paramName + name) as keyof IDrawSettings,
            newValue,
          )}
          defaultValues={getDefaultDrawSettings(button.paramName as string)}
        />)}
      </ButtonsBlock>)}
    </SidebarWrapper>
  )
})
