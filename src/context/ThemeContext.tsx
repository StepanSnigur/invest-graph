import React, { useState } from 'react'

export interface IThemeColors {
  mainBackground: string,
  secondaryBackground: string,
  button: string,
  lightButton: string,
  text: string,
  darkText: string,
  stockUp: string,
  stockDown: string,
  alert: string,
}
export type IAppTheme = {
  theme: IThemeColors
}
const DEFAULT_THEME_COLORS = {
  dark: {
    mainBackground: '#2a263d' ,
    secondaryBackground: '#141431',
    button: '#3b3853',
    lightButton: '#26264f',
    text: '#dcdccc',
    darkText: '#0f181f',
    stockUp: '#00bfa5',
    stockDown: '#f44336',
    alert: '#4bb1cf',
  },
  // TODO
  light: {
    mainBackground: '#1d1e20' ,
    secondaryBackground: '#1a1a24',
    button: '#303b51',
    lightButton: '#7c96af',
    text: '#dcdccc',
    darkText: '#0f181f',
    stockUp: '#00bfa5',
    stockDown: '#f44336',
    alert: '#4bb1cf',
  },
}
export const ThemeContext = React.createContext({
  colors: DEFAULT_THEME_COLORS.dark,
  darkTheme: true,
  setDarkTheme: (darkTheme: boolean) => {},
})

export const ThemeContextProvider: React.FC = ({ children }) => {
  const [darkTheme, setDarkTheme] = useState(true)

  return (
    <ThemeContext.Provider value={{
      darkTheme,
      setDarkTheme,
      colors: darkTheme ? DEFAULT_THEME_COLORS.dark : DEFAULT_THEME_COLORS.light,
    }}>
      {children}
    </ThemeContext.Provider>
  )
}
