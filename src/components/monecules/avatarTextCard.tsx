import { Box, Card, CardActionArea, CardContent, CardHeader, IconButton, Typography } from '@mui/material'
import { IconDots } from '@tabler/icons-react'
import React from 'react'
import { LoadingLayer } from '../atom/loadingLayer'

interface AvatarTextCardProps {
  title: string
  avatar: React.ReactNode
  menu?: React.ReactNode
  isLoading?: boolean
  onKebabMenuClicked?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  onCardClicked?: () => void
}

export const AvatarTextCard: React.FC<AvatarTextCardProps> = (props) => {
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
              <Typography
                sx={{
                  fontSize: '1.1em',
                  fontWeight: 'bold',
                  overflowWrap: 'revert'
                }}
              >
                {props.title}
              </Typography>
          </CardContent>
        </CardActionArea>
      </Card>

      {props.menu}
    </Box>
  )
}
