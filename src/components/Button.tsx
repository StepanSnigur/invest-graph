import React from 'react'
import styled from 'styled-components'

const ButtonWrapper = styled.button`
  padding: 15px 20px;
  border-radius: 8px;
  background: linear-gradient(-45deg, #354F7F, #9E919C);
  color: #fff;
  font-family: 'Montserrat', sans-serif;
  font-weight: 400;
  border: none;
  cursor: pointer;
`

export const Button: React.FC = ({ children }) => {
  return <ButtonWrapper>{children}</ButtonWrapper>
}
