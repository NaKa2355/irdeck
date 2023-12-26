import { createTheme } from '@mui/material'

export const lightThemePalette = createTheme({
  palette: {
    primary: {
      main: '#222222'
    },
    error: {
      main: '#ef5350'
    },
    text: {
      primary: '#444444',
      secondary: '#797f88'
    },
    background: {
      default: '#e5e5e5',
      paper: '#eeeeee'
    }
  }
}).palette
