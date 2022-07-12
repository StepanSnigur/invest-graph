import React, { useState, useMemo } from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles'

// export interface IThemeColors {
//   mainBackground: string,
//   secondaryBackground: string,
//   button: string,
//   lightButton: string,
//   text: string,
//   darkText: string,
//   stockUp: string,
//   stockDown: string,
//   alert: string,
// }
// const DEFAULT_THEME_COLORS = {
//   dark: {
//     mainBackground: '#2a263d' ,
//     secondaryBackground: '#141431',
//     button: '#3b3853',
//     lightButton: '#26264f',
//     text: '#dcdccc',
//     darkText: '#0f181f',
//     stockUp: '#00bfa5',
//     stockDown: '#f44336',
//     alert: '#4bb1cf',
//   },
//   // TODO
//   light: {
//     mainBackground: '#1d1e20' ,
//     secondaryBackground: '#1a1a24',
//     button: '#303b51',
//     lightButton: '#7c96af',
//     text: '#dcdccc',
//     darkText: '#0f181f',
//     stockUp: '#00bfa5',
//     stockDown: '#f44336',
//     alert: '#4bb1cf',
//   },
// }
export const ThemeContext = React.createContext({ toggleColorMode: () => {} })

export const ThemeContextProvider: React.FC = ({ children }) => {
  const [mode, setMode] = useState<'light' | 'dark'>('dark')
  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      text: mode === 'dark' ? {
        primary: '#b2b5be',
      } : {
        primary: '#b2b5be',
      },
      background: mode === 'dark' ? {
        default: '#141431',
        paper: '#2a263d',
      } : {
        default: '#1a1a24',
        paper: '#1d1e20',
      },
      primary: mode === 'dark' ? {
        main: '#26264f',
      } : {
        main: '#7c96af',
      },
      secondary: mode === 'dark' ? {
        main: '#3b3853',
      } : {
        main: '#303b51',
      },
    },
  }), [mode])

  const colorMode = useMemo(() => ({
    toggleColorMode: () => {
      setMode(prevMode => prevMode === 'dark' ? 'light' : 'dark')
    },
  }), [])

  return (
    <ThemeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  )
}
