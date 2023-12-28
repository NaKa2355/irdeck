import { CssBaseline, ThemeProvider } from '@mui/material'
import { customTheme, lightThemePalette } from './themes'
import { LearnRemotesPage } from './components/pages/learnRemotesPage'
import { AddRemoteModal } from './components/organisms/addRemoteModal'
import { EditRemoteModal } from './components/organisms/editRemoteModal'
import { ReceiveIrModal } from './components/organisms/receiveIrModal'
import { AppSnackbar } from './components/organisms/appSnackbar'
import { useState } from 'react'
import { NavigatorTemplate } from './components/templates/navigatorTemplate'
import { IconDeviceRemote, IconHome } from '@tabler/icons-react'

function App (): JSX.Element {
  const [selectedTab, selectTab] = useState('home')

  return (
    <ThemeProvider theme={customTheme(lightThemePalette)}>
      <CssBaseline />
      <NavigatorTemplate
        onChange={(_, value) => { selectTab(value) }}
        value={selectedTab}
        items={[
          {
            value: 'home',
            label: 'Home',
            icon: <IconHome />
          },
          {
            value: 'remote',
            label: 'Remote',
            icon: <IconDeviceRemote />
          }
        ]}
      >
        <>
          {selectedTab === 'remote' &&
            <LearnRemotesPage />
          }
          {selectedTab === 'home' &&
            <h1>Welcome Back!</h1>
          }
        </>
      </NavigatorTemplate>
      <AppSnackbar />
      <AddRemoteModal />
      <EditRemoteModal />
      <ReceiveIrModal />
    </ThemeProvider>
  )
}

export default App
