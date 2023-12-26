import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { ArrowBackIos } from '@mui/icons-material'

const drawerWidth = 240

interface Props {
  title?: string
  contents?: JSX.Element
  drawer?: JSX.Element
  isDrawerOpen?: boolean
  isDrawerLoading?: boolean
  isContentLoading?: boolean
  onIconClick?: () => void
  onDrawerClose?: () => void
  window?: () => Window
}

export const DrawerTemplate = (props: Props): JSX.Element => {
  const { window } = props
  const drawer = (
    <div>
      <Toolbar />
      <Box height={10} />
      {(props.isDrawerLoading ?? false) &&
        <p>Loading</p>
      }
      {!(props.isDrawerLoading ?? false) &&
        props.drawer
      }
    </div>
  )

  const container = window !== undefined ? () => window().document.body : undefined

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        elevation={0}
        position="fixed"
        sx={{
          backgroundColor: 'background.paper',
          color: 'text.primary',
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` }
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={props.onIconClick}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <ArrowBackIos />
            <Typography variant="h6" noWrap component="div" fontWeight='bold'>
              {props.title}
            </Typography>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={props.isDrawerOpen}
          onClose={props.onDrawerClose}
          ModalProps={{
            keepMounted: true // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderTop: 0 }
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        {(props.isContentLoading ?? false) &&
          <p>Loading</p>
        }
        {!(props.isContentLoading ?? false) &&
          props.contents
        }
      </Box>
    </Box >
  )
}
