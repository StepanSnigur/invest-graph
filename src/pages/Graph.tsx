import React from 'react'
import styled from 'styled-components'

import { ChartControls } from '../components/ChartControls'
import { Chart } from '../components/Chart'
import { ChartSidebar } from '../components/ChartSidebar'
import { ChartSubData } from '../components/ChartSubData'

const GraphWrapper = styled.div`
  height: 100vh;
  width: 100%;
`
const ChartContentWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  height: 80%;
`

interface IGraph {
  id: string
}
export const Graph: React.FC<IGraph> = ({ id }) => {
  return (
    <GraphWrapper>
      <ChartControls />
      <ChartContentWrapper>
        <Chart ticker={id} />
        <ChartSidebar />
      </ChartContentWrapper>
      <ChartSubData />
    </GraphWrapper>
  )
}
