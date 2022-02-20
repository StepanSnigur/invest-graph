import React, { useContext } from 'react'
import styled from 'styled-components'
import { IAppTheme, ThemeContext } from '../context/ThemeContext'

import FilledStar from '../assets/images/star-filled.png'
import EmptyStar from '../assets/images/star-empty.png'

const ButtonWrapper = styled.button`
  background: none;
  border: 1px solid ${(props: IAppTheme) => props.theme.lightButton};
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
  const { colors } = useContext(ThemeContext)

  return (
    <ButtonWrapper
      theme={colors}
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
