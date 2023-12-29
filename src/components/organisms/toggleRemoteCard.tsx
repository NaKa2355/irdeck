import React from 'react'
import { Box, Card, Divider, Typography } from '@mui/material'
import { IconToggleLeft } from '@tabler/icons-react'
import { LoadingButton } from '../atom/loadingButton'

interface ToggleRemoteCardPorps {
  title?: string
  loadingOn?: boolean
  loadingOff?: boolean
  onOn?: () => void
  onOff?: () => void
}

export const ToggleRemoteCard: React.FC<ToggleRemoteCardPorps> = (props) => {
  return (
    <Card sx={{ padding: '16px', height: '130px' }}>
      <Box sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Typography color='text.secondary'>
          <IconToggleLeft/>
        </Typography>
        <Box sx={{ display: 'flex', border: 'solid', borderWidth: 1, borderColor: 'divider', borderRadius: '10px' }}>
          <LoadingButton loading={props.loadingOn} onClick={props.onOn} sx={{ flexGrow: 1 }}>
            ON
          </LoadingButton>
          <Divider orientation="vertical" flexItem />
          <LoadingButton loading={props.loadingOff} onClick={props.onOff} sx={{ flexGrow: 1 }}>
            OFF
          </LoadingButton>
        </Box>
        <Typography sx={{ fontWeight: 'bold' }}>
          {props.title}
        </Typography>
      </Box>
    </Card>
  )
}
