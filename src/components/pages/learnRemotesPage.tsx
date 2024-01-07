import React from 'react'

// hooks
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

// redux
import { clearPostRemoteStatus } from '../../ducks/remotes'
import { addRemoteModalOpened, drawerClosed, drawerOpened } from '../../ducks/ui'
import { drawerSelector } from '../../ducks/ui/selector'
import { RemotesList } from '../organisms/remoteList'
import { ButtonsGrid } from '../organisms/buttonsGrid'
import { remoteSelector, selectedRemoteIdSelector } from '../../ducks/remotes/selector'
import { AppBar, Box, Drawer, IconButton, SpeedDial, Toolbar, Typography } from '@mui/material'
import { Add, ArrowBackIos } from '@mui/icons-material'

const drawerWidth = '240px'

export const LearnRemotesPage: React.FC<{ window?: () => Window }> = React.memo(function LearnRemotesPage (props) {
  const { window } = props
  const dispatch = useDispatch()
  const selectedRemoteId = useSelector(selectedRemoteIdSelector)
  const selectedRemote = useSelector(remoteSelector(selectedRemoteId))
  const { t } = useTranslation()
  const isDrawerOpen = useSelector(drawerSelector)
  const drawerListTitle = t('header.remotes')
  const onAddButtonClick = (): void => {
    dispatch(clearPostRemoteStatus())
    dispatch(addRemoteModalOpened())
  }

  const onDrawerClose = (): void => {
    dispatch(drawerClosed())
  }

  const onIconClick = (): void => {
    dispatch(drawerOpened())
  }

  const drawer = (
    <div>
      <Toolbar>
        <Typography fontWeight='bold' variant='h6' noWrap component='div'>
          {drawerListTitle}
        </Typography>
      </Toolbar>
      <SpeedDial
        onClick={onAddButtonClick}
        ariaLabel="add remote"
        sx={{ position: 'absolute', bottom: 16, left: 16 }}
        icon={<Add />}
      />
        <RemotesList></RemotesList>
    </div>
  )

  const container = window !== undefined ? () => window().document.body : undefined
  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        sx={{
          backgroundColor: 'background.paper',
          color: 'text.primary',
          display: { md: 'none', xs: 'block' }
        }}
      >
        <Toolbar>
          <IconButton
            color='inherit'
            aria-label='open drawer'
            edge='start'
            onClick={onIconClick}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <ArrowBackIos></ArrowBackIos>
            <Typography variant='h6' noWrap component='div'>
              {selectedRemote?.name}
            </Typography>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box
        component='nav'
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        aria-label='mailbox folders'
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant='temporary'
          open={isDrawerOpen}
          onClose={onDrawerClose}
          ModalProps={{
            keepMounted: true // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant='permanent'
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, left: 'auto' }
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component='main'
        sx={{ flexGrow: 1, p: 3, width: { md: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar sx={{ display: { xs: 'block', md: 'none' } }} />
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <h2 style={{ marginBottom: '10px' }}>{selectedRemote?.name}</h2>
        </Box>
        <ButtonsGrid></ButtonsGrid>
      </Box>
    </Box>
  )
})
