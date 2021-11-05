import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom'
import styled from 'styled-components'

import { Main } from './pages/Main'
import { Graph } from './pages/Graph'

const MainWrapper = styled.div`
  background: linear-gradient(90deg, #1d1e20, #1a1a24);
  min-height: 100vh;
`

const App = () => {
  return (
    <MainWrapper>
      <Router>
        <Switch>
          <Route path="/" exact component={Main} />
          <Route path="/graph/:id" render={({ match }) => {
            return <Graph id={match.params.id} />
          }}/>
        </Switch>
      </Router>
    </MainWrapper>
  )
}

export default App
