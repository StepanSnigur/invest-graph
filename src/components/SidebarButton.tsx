import React, { useState } from 'react'
import styled from 'styled-components'
import Slider from '@mui/material/Slider'

import Menu from '@mui/material/Menu'

const SidebarButtonIcon = styled.button`
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
  onParamChange: (name: string, newValue: any) => void,
  defaultValues: {
    LineWidth: number,
    Color: string,
  },
}
export const SidebarButton: React.FC<ISidebarButton> = ({
  background,
  icon,
  onClick,
  onContextMenu,
  title,
  isActive,
  onParamChange,
  defaultValues,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

  const handleContextMenuOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (onContextMenu) {
      setAnchorEl(e.currentTarget)
      onContextMenu()
    }
  }
  const handleContextMenuClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <SidebarButtonIcon
        background={background}
        onClick={onClick}
        onContextMenu={handleContextMenuOpen}
      >
        <ButtonIcon src={icon} alt={title} />
        {isActive ? <ActiveIndicator /> : null}
      </SidebarButtonIcon>
      <Menu
        style={{ padding: '10px' }}
        id="Sidebar button menu"
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={handleContextMenuClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          style: {
            padding: '2px 10px',
          },
        }}
      >
        <span>Толщина линии</span>
        <Slider
          size="small"
          value={defaultValues.LineWidth}
          aria-label="small"
          valueLabelDisplay="auto"
          min={1}
          max={15}
          onChange={(_, newValue) => onParamChange('LineWidth', newValue)}
        />
      </Menu>
    </>
  )
}
