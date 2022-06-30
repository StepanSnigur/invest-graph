import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom'
import styled from 'styled-components'

import { useTheme, Theme } from '@mui/material'
import { Main } from './pages/Main'
import { Graph } from './pages/Graph'

const MainWrapper = styled.div`
  background: ${({ theme }: { theme: Theme }) => theme.palette.background.paper};
  min-height: 100vh;
`

const App = () => {
  const theme = useTheme()

  return (
    <Router>
      <Switch>
        <MainWrapper theme={theme}>
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
