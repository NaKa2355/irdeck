import React from 'react'
import { Box, Card, CardActionArea, CardContent, Typography } from '@mui/material'
import { IconAirConditioningDisabled } from '@tabler/icons-react'

interface ThermostatRemoteCardPorps {
  title?: string
  onClick?: () => void
}

export const ThermostatRemoteCard: React.FC<ThermostatRemoteCardPorps> = (props) => {
  return (
    <Card sx={{ height: '130px' }}>
      <CardActionArea sx={{ height: '100%' }} onClick={props.onClick}>
        <CardContent sx={{ height: '100%' }}>
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Typography color='text.secondary'>
              <IconAirConditioningDisabled/>
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
