//libs
import { Add, ArrowBackIos, ArrowBackIosNew, BorderLeft } from "@mui/icons-material";
import { Link, Box, AppBar, Toolbar, Typography, SpeedDial, SpeedDialIcon, IconButton, Skeleton, Paper, Container, Breadcrumbs } from "@mui/material";


interface ListTemplateProps {
  title: string
  buttonName: string
  disableButton?: boolean
  backButton?: boolean
  list: JSX.Element
  isLoading?: boolean
  onClick?: () => void
  onBack?: () => void
}

function LoadingTemplate() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: "background.paper",
          color: "text.primary",
          boxShadow: 0,
          borderBottom: 1,
          borderColor: "divider"
        }}
      >
        <Toolbar />
      </AppBar>
      <Container sx={{ paddingTop: 2 }}>
        <Skeleton variant="text" sx={{ fontSize: '2rem', width: '100px' }} />
      </Container>
    </Box>
  )
}


export function ListTemplate(props: ListTemplateProps) {
  if (props.isLoading) {
    return (<LoadingTemplate />)
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: "background.paper",
          color: "text.primary",
          boxShadow: 0,
          borderBottom: 1,
          borderColor: "divider",
          borderRight: 0,
          borderTop: 0,
          borderLeft: 0,

        }}
      >
        <Toolbar>
          {props.backButton && (
            <IconButton
              color="inherit"
              onClick={props.onBack}
            >
              <ArrowBackIosNew />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      <Container sx={{ paddingTop: 2, paddingBottom: 2 }}>
        <Typography variant="h6" fontWeight="bold" component="div" sx={{ flexGrow: 1, paddingBottom: 2 }}>
          {props.title}
        </Typography>
        {props.list}
      </Container>

      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        icon={<Add />}
        onClick={props.onClick}
        hidden={props.disableButton}
      >
      </SpeedDial>
    </Box>
  );
}
