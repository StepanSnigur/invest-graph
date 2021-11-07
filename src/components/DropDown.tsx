import React, { useState } from 'react'
import styled from 'styled-components'

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
  background: #303b51;
  color: #dcdccc;
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
  position: absolute;
  left: 0;
  padding: 6px;
  margin-top: 6px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  background: #303b51;
  color: #dcdccc;
`
const DropDownOption = styled.button`
  padding: 7px 0;
  margin-bottom: 3px;
  color: #dcdccc;
  background: #303b51;
  border: none;
  border-radius: 8px;
  min-width: 200px;
  transition: .3s;
  cursor: pointer;
  
  &:hover {
    background: #7c96af;
    color: #0f181f;
  }
  &:last-child {
    margin-bottom: 0;
  }
`

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

  const handleDropDownClose = () => {
    setIsOpen(false)
  }

  return (
    <>
      {isOpen ? <DropDownOptionsBackground onClick={handleDropDownClose} /> : null}
      <DropDownWrapper>
        <DropDownButton onClick={() => setIsOpen(!isOpen)} showIcon={showIcon}>
          {title}
          {showIcon
            ? <DropDownIndicator isOpen={isOpen}>&#129171;</DropDownIndicator>
            : null}
        </DropDownButton>
        {isOpen ? <DropDownOptionsWrapper>
          {options.map((option, i) => (
            <DropDownOption
              key={i}
              onClick={() => {
                option.onPress(option.name)
                handleDropDownClose()
              }}
            >{option.name}</DropDownOption>
          ))}
        </DropDownOptionsWrapper> : null}
      </DropDownWrapper>
    </>
  )
}
