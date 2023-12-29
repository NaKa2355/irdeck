import { CssBaseline, ThemeProvider } from '@mui/material'
import { customTheme, lightThemePalette } from './themes'
import { LearnRemotesPage } from './components/pages/learnRemotesPage'
import { AddRemoteModal } from './components/organisms/addRemoteModal'
import { EditRemoteModal } from './components/organisms/editRemoteModal'
import { ReceiveIrModal } from './components/organisms/receiveIrModal'
import { AppSnackbar } from './components/organisms/appSnackbar'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App (): JSX.Element {
  return (
    <ThemeProvider theme={customTheme(lightThemePalette)}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
            <Route path={'/remote/'} element={<LearnRemotesPage></LearnRemotesPage>} />
            <Route path={'/home'} element={<h1>Welcome Back!</h1>} />
        </Routes>
      </BrowserRouter>
      <AppSnackbar />
      <AddRemoteModal />
      <EditRemoteModal />
      <ReceiveIrModal />
    </ThemeProvider>
  )
}

export default App
