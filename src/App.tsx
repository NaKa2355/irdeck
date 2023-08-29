import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { RootRouter } from './route/router'; import { RecoilRoot } from 'recoil';
import { DrawerPage } from './composes/pages/drawerPage';
;

function App() {

  const palette = createTheme({
    palette: {
      text: {
        primary: "#383b59",
        secondary: "#888B95",
      },
      background: {
        // Purple and green play nicely together.
        default: "#fafafa",
        paper: "#ffffff"
      },
    }
  }).palette;


  const theme = createTheme({
    shadows: ['none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none'],
    palette: palette,
    components: {
      MuiDialogTitle: {
        styleOverrides: {
          root: {
            borderBottom: "solid",
            borderBottomWidth: 1,
            borderBottomColor: palette.divider,
            backgroundColor: palette.background.default,
          }
        }
      },

      MuiMenuItem: {
        styleOverrides: {
          root: {
            borderRadius: "5px",
            marginLeft: "5px",
            marginRight: "5px",
          },

        }
      },

      MuiDialog: {
        styleOverrides: {
          root: {
            backdropFilter: "blur(2px)",

          }
        }
      },

      MuiInputBase: {
        styleOverrides: {
          root: {
            height: "2.5rem"
          },

        }
      },

      MuiFormLabel: {
        styleOverrides: {
          root: {
            fontSize: "0.8rem"
          },
        }
      },

      MuiButton: {
        styleOverrides: {
          root: {
            border: "solid",
            borderWidth: 1,
            borderColor: palette.divider,
          },

          outlined: {
            color: palette.text.primary
          },
        },
      },

      MuiPaper: {
        styleOverrides: {
          root: {
            border: "solid",
            borderWidth: 1,
            borderColor: palette.divider
          }
        }
      },



    },
  })

  return (
    <ThemeProvider theme={theme}>
      <RecoilRoot>
        <CssBaseline />
        <DrawerPage />
      </RecoilRoot>
    </ThemeProvider>
  );
}


export default App;
