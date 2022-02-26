import React, { useContext } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom'
import styled from 'styled-components'

import { ThemeContext, IAppTheme } from './context/ThemeContext'
import { Main } from './pages/Main'
import { Graph } from './pages/Graph'

const MainWrapper = styled.div`
  background: ${({ theme }: IAppTheme) => theme.mainBackground};
  min-height: 100vh;
`

const App = () => {
  const themeContext = useContext(ThemeContext)

  return (
    <Router>
      <Switch>
        <MainWrapper theme={themeContext.colors}>
          <Route path="/" exact component={Main} />
          <Route path="/graph/:id" render={({ match }) => {
            return <Graph id={match.params.id} />
          }}/>
        </MainWrapper>
      </Switch>
    </Router>
  )
}

export default App
