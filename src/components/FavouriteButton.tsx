import React from 'react'
import styled from 'styled-components'
import { useTheme, Theme } from '@mui/material'

import FilledStar from '../assets/images/star-filled.png'
import EmptyStar from '../assets/images/star-empty.png'

const ButtonWrapper = styled.button`
  background: none;
  border: 1px solid ${({ theme }: { theme: Theme }) => theme.palette.secondary.main};
  border-radius: 6px;
  cursor: pointer;
`
const StarImage = styled.img`
  width: 90%;
`

interface IFavouriteButton {
  width: number,
  height: number,
  onChange: (state: boolean) => void,
  isChecked: boolean,
}
export const FavouriteButton: React.FC<IFavouriteButton> = ({ width, height, onChange, isChecked }) => {
  const theme = useTheme()

  return (
    <ButtonWrapper
      theme={theme}
      onClick={() => onChange(!isChecked)}
      style={{
        width,
        height,
      }}
    >
      <StarImage src={isChecked ? FilledStar : EmptyStar} alt="favourite" />
    </ButtonWrapper>
  )
}
