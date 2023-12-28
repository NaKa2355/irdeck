import React, { type ReactNode } from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { Add, ArrowBackIos } from '@mui/icons-material'
import { List, SpeedDial } from '@mui/material'

const drawerWidth = '240px'

interface NavigationItems {
  label: string
  value: string
  icon: ReactNode
}

interface Props {
  title?: string
  drawerTitle?: string
  buttonsCards?: ReactNode
  remotesListItems?: ReactNode[]
  isDrawerOpen?: boolean
  isDrawerLoading?: boolean
  isContentLoading?: boolean
  navigationValue?: string
  items?: NavigationItems[]
  onNavigationChange?: (e: any, value: string) => void
  onIconClick?: () => void
  onAddButtonClick?: () => void
  onDrawerClose?: () => void
  window?: () => Window
}

export const LearnRemotesTemplate: React.FC<Props> = (props) => {
  const { window } = props
  const drawer = (
    <div>
      <Toolbar>
        <Typography fontWeight='bold' variant='h6' noWrap component='div'>
          {props.drawerTitle}
        </Typography>
      </Toolbar>
      <SpeedDial
        onClick={props.onAddButtonClick}
        ariaLabel="add remote"
        sx={{ position: 'absolute', bottom: 16, left: 16 }}
        icon={<Add />}
      />
      {(props.isDrawerLoading ?? false) &&
        <p>Loading</p>
      }
      {!(props.isDrawerLoading ?? false) &&
        <List>
          {props.remotesListItems}
        </List>
      }
    </div>
  )

  const container = window !== undefined ? () => window().document.body : undefined
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
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
            onClick={props.onIconClick}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <ArrowBackIos></ArrowBackIos>
            <Typography variant='h6' noWrap component='div'>
              {props.title}
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
          open={props.isDrawerOpen}
          onClose={props.onDrawerClose}
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
        <Toolbar />
        {props.buttonsCards}
      </Box>
    </Box>
  )
}
