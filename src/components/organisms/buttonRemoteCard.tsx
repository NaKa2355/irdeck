import React from 'react'
import { Box, Card, CardActionArea, CardContent, Typography } from '@mui/material'
import { IconCircuitPushbutton } from '@tabler/icons-react'
import { LoadingLayer } from '../atom/loadingLayer'

interface ButtonRemoteCardPorps {
  title?: string
  loading?: boolean
  onClick?: () => void
}

export const ButtonRemoteCard: React.FC<ButtonRemoteCardPorps> = (props) => {
  return (
    <Card sx={{ height: '130px', position: 'relative' }}>
      <LoadingLayer loading={props.loading} />
      <CardActionArea sx={{ height: '100%' }} onClick={props.onClick} disabled={props.loading}>
        <CardContent sx={{ height: '100%' }}>
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Typography color='text.secondary'>
              <IconCircuitPushbutton/>
            </Typography>
            <Typography sx={{ fontWeight: 'bold' }}>
              {props.title}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
