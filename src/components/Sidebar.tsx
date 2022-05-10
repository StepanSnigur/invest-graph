import React from 'react'
import styled from 'styled-components'

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
  icon: string,
  background: string,
  onClick: () => void,
  isActive?: boolean,
  title?: string,
}
interface IButtonsBlocks {
  background: string,
  buttons: ISidebarButton[],
}
interface ISidebar {
  buttonsBlocks: IButtonsBlocks[]
}
export const Sidebar: React.FC<ISidebar> = ({ buttonsBlocks }) => {
  return (
    <SidebarWrapper>
      {buttonsBlocks.map((buttonBlock, i) => <ButtonsBlock background={buttonBlock.background} key={i}>
        {buttonBlock.buttons.map((button, j) => <SidebarButton
          background={button.background}
          onClick={button.onClick}
          key={j}
        >
          <ButtonIcon src={button.icon} alt="button" title={button.title}/>
          {button.isActive ? <ActiveIndicator /> : null}
        </SidebarButton>)}
      </ButtonsBlock>)}
    </SidebarWrapper>
  )
}
