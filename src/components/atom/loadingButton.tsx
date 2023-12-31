import { Box, Button, CircularProgress, type ButtonProps as MuiButtonProps } from '@mui/material'
import React from 'react'

interface LoadingButtonProps extends MuiButtonProps {
  loading?: boolean
}

export const LoadingButton: React.FC<LoadingButtonProps> = (props) => {
  return (
    <Button {...props as MuiButtonProps} disabled={props.loading}>
      <Box sx={{ position: 'relative', width: 'fit-content' }}>
        {(props.loading ?? false) &&
          <Box sx={{
            position: 'absolute',
            height: '100%',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <CircularProgress size='1em' />
          </Box>
        }
        {props.children}
      </Box>
    </Button>
  )
}
