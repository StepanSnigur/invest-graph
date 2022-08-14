import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { reaction } from 'mobx'
import styled from 'styled-components'
import { chart } from '../store/chart'

import Fade from '@mui/material/Fade'
import Alert from '@mui/material/Alert'

const AlertMessage = styled(Alert)`
  position: fixed;
  top: 15px;
  left: 15px;
  z-index: 999;
`

export const ChartAlertSystem = observer(() => {
  const [errorText, setErrorText] = useState('')

  useEffect(() => reaction(
    () => chart.alertMessage,
    () => {
      if (chart.alertMessage) {
        setErrorText(chart.alertMessage)
      }
    }
  ))

  return <Fade in={!!chart.alertMessage}>
    <AlertMessage
      severity="error"
    >{errorText}</AlertMessage>
  </Fade>
})
