import React from 'react'
import { Box, Card, Divider, Typography } from '@mui/material'
import { IconToggleLeft } from '@tabler/icons-react'
import { LoadingButton } from '../atom/loadingButton'
import { type RemoteId } from '../../type/remote'
import { useDispatch, useSelector } from 'react-redux'
import { buttonsSelector, pushButtonRequested } from '../../ducks/buttons'
import { pushButtonStateSelector } from '../../ducks/buttons/selector'

interface ToggleRemoteCardPorps {
  title?: string
  remoteId: RemoteId
}

export const ToggleRemoteCard: React.FC<ToggleRemoteCardPorps> = (props) => {
  const buttons = useSelector(buttonsSelector(props.remoteId))
  const dispatch = useDispatch()
  const onButtonId = buttons?.find((button) => button.name === 'on')?.id
  const offButtonId = buttons?.find((button) => button.name === 'off')?.id
  const pushingOn = useSelector(pushButtonStateSelector(onButtonId ?? ''))?.status === 'pending'
  const pushingOff = useSelector(pushButtonStateSelector(offButtonId ?? ''))?.status === 'pending'

  const onOnPush = (): void => {
    if (onButtonId === undefined) {
      return
    }
    dispatch(pushButtonRequested({ buttonId: onButtonId }))
  }

  const onOffPush = (): void => {
    if (offButtonId === undefined) {
      return
    }
    dispatch(pushButtonRequested({ buttonId: offButtonId }))
  }

  return (
    <Card sx={{ padding: '16px', height: '130px' }}>
      <Box sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Typography color='text.secondary'>
          <IconToggleLeft/>
        </Typography>
        <Box sx={{ display: 'flex', border: 'solid', borderWidth: 1, borderColor: 'divider', borderRadius: '10px' }}>
          <LoadingButton loading={pushingOn} onClick={onOnPush} sx={{ flexGrow: 1 }}>
            ON
          </LoadingButton>
          <Divider orientation="vertical" flexItem />
          <LoadingButton loading={pushingOff} onClick={onOffPush} sx={{ flexGrow: 1 }}>
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
