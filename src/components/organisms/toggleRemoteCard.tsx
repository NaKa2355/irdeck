import React from 'react'
import { Box, Card, Divider, Typography } from '@mui/material'
import { IconToggleLeft } from '@tabler/icons-react'
import { LoadingButton } from '../atom/loadingButton'
import { type RemoteId } from '../../type/remote'
import { useDispatch, useSelector } from 'react-redux'
import { buttonsSelector, pushButtonRequested } from '../../ducks/buttons'
import { pushButtonStateSelector } from '../../ducks/buttons/selector'
import { snackBarShown } from '../../ducks/ui'

interface ToggleRemoteCardPorps {
  title?: string
  remoteId: RemoteId
}

export const ToggleRemoteCard: React.FC<ToggleRemoteCardPorps> = (props) => {
  const buttons = useSelector(buttonsSelector(props.remoteId))
  const dispatch = useDispatch()
  const onButton = buttons?.find((button) => button.name === 'on')
  const offButton = buttons?.find((button) => button.name === 'off')
  const pushingOn = useSelector(pushButtonStateSelector(onButton?.id ?? ''))?.status === 'pending'
  const pushingOff = useSelector(pushButtonStateSelector(offButton?.id ?? ''))?.status === 'pending'

  const showNoIrDataWarning = (): void => {
    dispatch(snackBarShown({
      message: 'label.no_irdata',
      severity: 'warning'
    }))
  }
  const onOnPush = (): void => {
    if (onButton?.id === undefined) {
      return
    }
    if (!onButton?.hasIrData) {
      showNoIrDataWarning()
      return
    }
    dispatch(pushButtonRequested({ buttonId: onButton.id }))
  }

  const onOffPush = (): void => {
    if (offButton?.id === undefined) {
      return
    }
    if (!offButton?.hasIrData) {
      showNoIrDataWarning()
      return
    }
    dispatch(pushButtonRequested({ buttonId: offButton.id }))
  }

  return (
    <Card sx={{ padding: '16px', height: '130px' }}>
      <Box sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Typography color='text.secondary'>
          <IconToggleLeft />
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
