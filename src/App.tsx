import { CssBaseline, ThemeProvider } from '@mui/material'
import { customTheme, lightThemePalette } from './themes'
import { DrawerPage } from './components/pages/drawerPage'

function App (): JSX.Element {
  return (
    <ThemeProvider theme={customTheme(lightThemePalette)}>
      <CssBaseline />
      <DrawerPage></DrawerPage>
    </ThemeProvider>
  )
}

export default App
