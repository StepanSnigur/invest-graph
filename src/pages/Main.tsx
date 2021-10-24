import React from 'react'
import styled from 'styled-components'

import { Header } from '../components/Header'

const ContentWrapper = styled.div`
  width: 1280px;
  margin: 0 auto;
`

export const Main = () => {
  return (
    <ContentWrapper>
      <Header />
    </ContentWrapper>
  )
}
