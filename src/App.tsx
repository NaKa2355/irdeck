import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import { DrawerPage } from './components/pages/drawerPage'

function App (): JSX.Element {
  const palette = createTheme({
    palette: {
      text: {
        primary: '#383b59',
        secondary: '#888B95'
      },
      background: {
        // Purple and green play nicely together.
        default: '#fafafa',
        paper: '#ffffff'
      }
    }
  }).palette

  const theme = createTheme({
    shadows: ['none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none'],
    palette,
    components: {
      MuiDialogTitle: {
        styleOverrides: {
          root: {
            borderBottom: 'solid',
            borderBottomWidth: 1,
            borderBottomColor: palette.divider,
            backgroundColor: palette.background.default
          }
        }
      },

      MuiMenuItem: {
        styleOverrides: {
          root: {
            borderRadius: '5px',
            marginLeft: '5px',
            marginRight: '5px'
          }

        }
      },

      MuiDialog: {
        styleOverrides: {
          root: {
            backdropFilter: 'blur(2px)'

          }
        }
      },

      MuiInputBase: {
        styleOverrides: {
          root: {
            height: '2.5rem'
          }

        }
      },

      MuiFormLabel: {
        styleOverrides: {
          root: {
            fontSize: '0.8rem'
          }
        }
      },

      MuiButton: {
        styleOverrides: {
          root: {
            border: 'solid',
            borderWidth: 1,
            borderColor: palette.divider
          },

          outlined: {
            color: palette.text.primary
          }
        }
      },

      MuiPaper: {
        styleOverrides: {
          root: {
            border: 'solid',
            borderWidth: 1,
            borderColor: palette.divider
          }
        }
      },

      MuiCard: {
        styleOverrides: {
          root: {
            borderWidth: 0,
            borderRadius: '10px',
            boxShadow: '0px 0px 15px ' + palette.divider
          }
        }
      },

      MuiAppBar: {
        styleOverrides: {
          root: {
            borderLeft: 0,
            borderRight: 0,
            borderTop: 0
          }
        }
      },

      MuiToolbar: {
        styleOverrides: {
          root: {
            borderLeft: 0,
            borderRight: 0,
            borderTop: 0
          }
        }
      }
    }
  })

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DrawerPage />
    </ThemeProvider>
  )
}

export default App
