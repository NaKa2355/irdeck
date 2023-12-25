import { createTheme } from '@mui/material'

export const lightThemePalette = createTheme({
  palette: {
    text: {
      primary: '#383b59',
      secondary: '#797f88'
    },
    background: {
      // Purple and green play nicely together.
      default: '#f7f8fc',
      paper: '#ffffff'
    }
  }
}).palette
