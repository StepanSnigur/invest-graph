import React, { useState, useContext, useRef } from 'react'
import styled from 'styled-components'
import { IAppTheme, ThemeContext } from '../context/ThemeContext'

const DropDownWrapper = styled.div`
  height: 80%;
  position: relative;
`
const DropDownButton = styled.button`
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0 2px;
  padding: ${(props: { showIcon: boolean }) => props.showIcon ? '0 24px 0 16px' : '0 10px'};
  border: none;
  border-radius: 8px;
  background: ${(props: IAppTheme) => props.theme.button};
  color: ${(props: IAppTheme) => props.theme.text};
  cursor: pointer;
`
const DropDownIndicator = styled.span`
  width: 16px;
  height: 16px;
  position: absolute;
  top: 50%;
  right: 6px;
  transform: translateY(-50%) rotate(${(props: { isOpen: boolean }) => props.isOpen ? '-180deg' : '0deg'});
  font-size: 22px;
  margin-left: 3px;
  transition: .3s;
  
`
const DropDownOptionsBackground = styled.div`
  position: fixed;
  width: 100%;
  height: 200%;
`
const DropDownOptionsWrapper = styled.div`
  box-sizing: border-box;
  position: absolute;
  left: 0;
  padding: 6px;
  margin-top: 6px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  background: ${(props: IAppTheme) => props.theme.button};
  color: ${(props: IAppTheme) => props.theme.text};
  overflow: hidden;
`
const DropDownOption = styled.button`
  padding: 7px 0;
  margin-bottom: 3px;
  color: #dcdccc;
  background: ${(props: IAppTheme) => props.theme.button};
  border: none;
  border-radius: 8px;
  min-width: 200px;
  transition: .3s;
  cursor: pointer;
  
  &:hover {
    background: ${(props: IAppTheme) => props.theme.lightButton};
    color: ${(props: IAppTheme) => props.theme.darkText};
  }
  &:last-child {
    margin-bottom: 0;
  }
`

interface DropDownIntersections {
  top: boolean,
  left: boolean,
  right: boolean,
  bottom: boolean,
}
interface IOption {
  name: string
  onPress:(value: string) => void
}
interface IDropDown {
  title: string
  options: IOption[]
  showIcon?: boolean
}
export const DropDown: React.FC<IDropDown> = ({ title, options, showIcon = false }) => {
  const [isOpen, setIsOpen] = useState(false)
  const themeContext = useContext(ThemeContext)
  const dropDownRef = useRef<HTMLDivElement | null>(null)

  const isDropDownVisible = (): DropDownIntersections | null => {
    if (dropDownRef.current) {
      const measures = dropDownRef.current.getBoundingClientRect()
      return {
        top: measures.top >= 0,
        left: measures.left >= 0,
        bottom: measures.bottom <= window.innerHeight,
        right: measures.right <= window.innerWidth,
      } as DropDownIntersections
    }
    return null
  }
  const handleDropDownToggle = () => {
    if (!isOpen && dropDownRef.current) {
      const intersections = isDropDownVisible()

      // if element intersects right view border, move it to the left
      if (intersections && !intersections.right) {
        dropDownRef.current.style.left = 'auto'
        dropDownRef.current.style.right = '0px'
      }
    }

    setIsOpen(!isOpen)
  }
  const handleDropDownClose = () => {
    setIsOpen(false)
  }

  return (
    <>
      {isOpen ? <DropDownOptionsBackground onClick={handleDropDownClose} /> : null}
      <DropDownWrapper>
        <DropDownButton
          onClick={handleDropDownToggle}
          showIcon={showIcon}
          theme={themeContext.colors}
        >
          {title}
          {showIcon
            ? <DropDownIndicator isOpen={isOpen}>&#129171;</DropDownIndicator>
            : null}
        </DropDownButton>
        <DropDownOptionsWrapper
          theme={themeContext.colors}
          ref={dropDownRef}
          style={{
            height: isOpen ? 'auto' : 0,
            padding: isOpen ? '6px' : 0,
            marginTop: isOpen ? '6px' : 0,
          }}
        >
          {options.map((option, i) => (
            <DropDownOption
              key={i}
              onClick={() => {
                option.onPress(option.name)
                handleDropDownClose()
              }}
              theme={themeContext.colors}
            >{option.name}</DropDownOption>
          ))}
        </DropDownOptionsWrapper>
      </DropDownWrapper>
    </>
  )
}
