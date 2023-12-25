import { CssBaseline, ThemeProvider } from '@mui/material'
import { DrawerPage } from './components/pages/drawerPage'
import { customTheme, lightThemePalette } from './themes'

function App (): JSX.Element {
  return (
    <ThemeProvider theme={customTheme(lightThemePalette)}>
      <CssBaseline />
      <DrawerPage />
    </ThemeProvider>
  )
}

export default App
