import React from 'react'
import styled from 'styled-components'

import { Sidebar } from '../components/Sidebar'
import { ChartControls } from '../components/ChartControls'
import { Chart } from '../components/Chart'
import { ChartSidebar } from '../components/ChartSidebar'
import { ChartSubData } from '../components/ChartSubData'

const ChartPage = styled.div`
  display: flex;
`
const GraphWrapper = styled.div`
  height: 100vh;
  width: 95%;
`
const ChartContentWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  height: 80%;
`

interface IGraph {
  id: string
}
export const Graph: React.FC<IGraph> =({ id }) => {
  return (
    <ChartPage>
      <Sidebar />
      <GraphWrapper>
        <ChartControls />
        <ChartContentWrapper>
          <ChartSidebar />
          <Chart ticker={id} />
        </ChartContentWrapper>
        <ChartSubData />
      </GraphWrapper>
    </ChartPage>
  )
}
