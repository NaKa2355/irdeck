import { Box, Card, CardActionArea, CardContent, CardHeader, CircularProgress, Grid, IconButton, Typography } from '@mui/material'
import { IconDots } from '@tabler/icons-react'
import React from 'react'
import { type ReactNode } from 'react'

const LoadingLayer = (props: { loading?: boolean }): ReactNode => {
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

interface AvatarTextCardProps {
  title: string
  avatar: React.ReactNode
  menu: React.ReactNode
  isLoading?: boolean
  onKebabMenuClicked?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  onCardClicked?: () => void
}

export const AvatarTextCard = (props: AvatarTextCardProps): JSX.Element => {
  return (
    <Box>
      <Card variant="outlined" sx={{ position: 'relative' }}>
        <LoadingLayer loading={props.isLoading} />
        <CardHeader
          avatar={props.avatar}

          action={
            <IconButton
              disabled={props.isLoading}
              onMouseDown={(event) => {
                event.stopPropagation()
              }}

              onClick={(event) => {
                event.stopPropagation()
                event.preventDefault()
                props.onKebabMenuClicked?.(event)
              }}
            >
              <IconDots size={20} />
            </IconButton>
          }
        />
        <CardActionArea
          disabled={props.isLoading}
          onClick={props.onCardClicked}
          sx={{ borderRadius: 0 }}>

          <CardContent>
            <Grid
              container
              direction="column"
              justifyContent="flex-end"
              alignItems="flex-start"
              height="2em"
            >
              <Typography
                sx={{
                  fontSize: '1em',
                  fontWeight: 'bold',
                  overflowWrap: 'revert'
                }}
              >
                {props.title}
              </Typography>
            </Grid>
          </CardContent>
        </CardActionArea>
      </Card>

      {props.menu}
    </Box>
  )
}
