import React, { useState } from 'react'

export interface IThemeColors {
  mainBackground: string,
  secondaryBackground: string,
  button: string,
  lightButton: string,
  text: string,
  darkText: string,
}
export type IAppTheme = {
  theme: IThemeColors
}
const DEFAULT_THEME_COLORS = {
  dark: {
    mainBackground: '#1d1e20' ,
    secondaryBackground: '#1a1a24',
    button: '#303b51',
    lightButton: '#7c96af',
    text: '#dcdccc',
    darkText: '#0f181f',
  },
  // TODO
  light: {
    mainBackground: '#1d1e20' ,
    secondaryBackground: '#1a1a24',
    button: '#303b51',
    lightButton: '#7c96af',
    text: '#dcdccc',
    darkText: '#0f181f',
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
