import { createTheme } from '@mui/material'

export const lightThemePalette = createTheme({
  palette: {
    primary: {
      main: '#000000'
    },
    error: {
      main: '#ef5350'
    },
    text: {
      primary: '#000000',
      secondary: '#908f94'
    },
    background: {
      default: '#f3f2f8',
      paper: '#ffffff'
    }
  }
}).palette
