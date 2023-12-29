import { Box, CircularProgress, Grid } from '@mui/material'
import React from 'react'

interface Props {
  loading?: boolean
}

export const LoadingLayer: React.FC<Props> = (props) => {
  return (
    <Box sx={{
      position: 'absolute',
      pointerEvents: 'none',
      width: '100%',
      height: '100%',
      opacity: (props.loading ?? false) ? '1' : '0',
      transition: 'all 0.3s ease-in-out'
    }}>
      <Box sx={{
        position: 'absolute',
        backgroundColor: 'text.primary',
        opacity: '0.3',
        width: '100%',
        height: '100%'
      }}>
      </Box>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        height="100%"
      >
        <Grid item>
          <CircularProgress />
        </Grid>
      </Grid>
    </Box>
  )
}
