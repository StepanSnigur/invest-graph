import React from 'react'
import styled from 'styled-components'
import logo from '../assets/images/logo.png'
import { Button } from './Button'

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
  font-family: 'Montserrat', sans-serif;
`
const HeaderSegment = styled.div`
  display: flex;
  align-items: center;
  
  &:last-child > button {
    margin-left: 10px;
  }
`
const HeaderLogo = styled.img`
  max-width: 40px;
  max-height: 40px;
`
const HeaderLogoText = styled.h3`
  font-weight: 700;
  margin-left: 10px;
  color: #fff;
`

export const Header = () => {
  return (
    <HeaderWrapper>
      <HeaderSegment>
        <HeaderLogo src={logo} alt="InvestGraph" />
        <HeaderLogoText>InvestGraph</HeaderLogoText>
      </HeaderSegment>
      <HeaderSegment>
        <Button>Зарегистрироваться</Button>
        <Button>Войти</Button>
      </HeaderSegment>
    </HeaderWrapper>
  )
}
