import { type Theme } from '@emotion/react'
import { type Palette, createTheme } from '@mui/material'

export const customTheme = (palette: Palette): Theme => {
  return createTheme({
    palette,
    shadows: ['none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none'],
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

      MuiButtonBase: {
        defaultProps: {
          disableRipple: true
        }
      },

      MuiListItem: {
        styleOverrides: {
          selected: {
            background: 'red'
          }
        }
      },

      MuiButton: {
        styleOverrides: {
          disableElevation: true,
          outlined: {
            ':hover': {
              borderColor: palette.divider
            },
            border: 'solid',
            borderWidth: 1,
            borderColor: palette.divider,
            color: palette.text.primary
          }
        }
      },

      MuiMenu: {
        styleOverrides: {
          list: {
            border: 'solid',
            borderRadius: '4px',
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
            borderWidth: 0
          }
        }
      },

      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderBottomRightRadius: 20,
            borderTopRightRadius: 20
          }
        }
      },

      MuiToolbar: {
        styleOverrides: {
          root: {
            borderWidth: 0
          }
        }
      }
    }
  })
}
