import React, { type ReactNode } from 'react'
import { type Theme } from '@emotion/react'
import { BottomNavigation, BottomNavigationAction, Box, Drawer, List, ListItem, ListItemButton, Toolbar, type SxProps, Tooltip, Typography } from '@mui/material'

const bottomNavigationStyle: SxProps<Theme> = {
  position: 'fixed',
  display: { xs: 'flex', md: 'none' },
  width: '100%',
  backgroundColor: 'background.paper',
  paddingBottom: 'env(safe-area-inset-bottom)',
  bottom: 0,
  zIndex: 100
}

const drawerWidth = '100px'

const drawerStyle: SxProps<Theme> = {
  display: { md: 'flex', xs: 'none' },
  '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
  left: 0
}

interface NavigationItems {
  label: string
  value: string
  icon: ReactNode
}

interface NavigatorTemplateProps {
  items?: NavigationItems[]
  value?: string
  onChange?: (e: any, value: string) => void
  children?: ReactNode
}

export const NavigatorTemplate: React.FC<NavigatorTemplateProps> = (props) => {
  const navItems = props.items?.map((item) => {
    return (
      <BottomNavigationAction key={item.value} value={item.value} label={item.label} icon={item.icon} />
    )
  })

  const drawerItems = props.items?.map((item) => {
    return (
      <ListItem key={item.value} value={item.value}>
        <Tooltip title={item.value}>
          <ListItemButton
            onClick={(e) => { props.onChange?.(e, item.value) }}
            selected={item.value === props.value}
            sx={{ justifyContent: 'center' }}>
            <Typography color='text.secondary'>
              {item.icon}
            </Typography>
          </ListItemButton>
        </Tooltip>
      </ListItem>
    )
  })
  return (
    <Box>
      <Box sx={{ display: { md: 'block', xs: 'none' } }}>
        <Drawer sx={drawerStyle} variant="permanent" open={true}>
          <List>
            {drawerItems}
          </List>
        </Drawer>
        <Box sx={{ paddingLeft: drawerWidth, width: `calc(100% - ${drawerWidth}}))` }}>
          {props.children}
        </Box>
      </Box>

      <Box sx={{ display: { md: 'none', xs: 'block' } }}>
        <Box sx={bottomNavigationStyle}>
          <BottomNavigation
            sx={{ width: '100%' }}
            value={props.value}
            onChange={props.onChange}
          >
            <Toolbar />
            {navItems}
          </BottomNavigation>
        </Box>
        <Box sx={{ marginLeft: 0, width: '100%' }}>
          {props.children}
          <BottomNavigation sx={{ backgroundColor: 'background.default' }}></BottomNavigation>
        </Box>
      </Box>
    </Box>
  )
}
