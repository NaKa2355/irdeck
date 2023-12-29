import { Box, CssBaseline, ThemeProvider } from '@mui/material'
import { customTheme, lightThemePalette } from './themes'
import { LearnRemotesPage } from './components/pages/learnRemotesPage'
import { AddRemoteModal } from './components/organisms/addRemoteModal'
import { EditRemoteModal } from './components/organisms/editRemoteModal'
import { ReceiveIrModal } from './components/organisms/receiveIrModal'
import { AppSnackbar } from './components/organisms/appSnackbar'
import React, { useState } from 'react'
import { NavigatorTemplate } from './components/templates/navigatorTemplate'
import { IconDeviceRemote, IconHome } from '@tabler/icons-react'
import { RemoteUsagePage } from './components/pages/remoteUsagePage'

const PageSwitcher: React.FC = () => {
  const [selectedTab, selectTab] = useState('home')
  return (
    <NavigatorTemplate
      onChange={(_, value) => {
        selectTab(value)
      }}
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
        <Box sx={{ display: selectedTab === 'remote' ? 'block' : 'none' }}>
          <LearnRemotesPage />
        </Box>
        <Box sx={{ display: selectedTab === 'home' ? 'block' : 'none' }}>
          <RemoteUsagePage />
        </Box>
      </>
    </NavigatorTemplate>
  )
}

function App (): JSX.Element {
  return (
    <ThemeProvider theme={customTheme(lightThemePalette)}>
      <CssBaseline />
      <PageSwitcher />
      <AppSnackbar />
      <AddRemoteModal />
      <EditRemoteModal />
      <ReceiveIrModal />
    </ThemeProvider>
  )
}

export default App
