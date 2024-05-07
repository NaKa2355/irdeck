import React from 'react'
import { Box, Card, CardActionArea, CardContent, Typography } from '@mui/material'
import { IconCircuitPushbutton } from '@tabler/icons-react'
import { LoadingLayer } from '../atom/loadingLayer'
import { type RemoteId } from '../../type/remote'
import { useDispatch, useSelector } from 'react-redux'
import { buttonsSelector, pushButtonRequested } from '../../ducks/buttons'
import { pushButtonStateSelector } from '../../ducks/buttons/selector'
import { snackBarShown } from '../../ducks/ui'

interface ButtonRemoteCardPorps {
  title?: string
  remoteId: RemoteId
}

export const ButtonRemoteCard: React.FC<ButtonRemoteCardPorps> = (props) => {
  const buttons = useSelector(buttonsSelector(props.remoteId))
  const dispatch = useDispatch()
  const pushButton = buttons?.find(button => button.name === 'push')
  const isPushing = useSelector(pushButtonStateSelector(pushButton?.id ?? ''))?.status === 'pending'

  const onPush = (): void => {
    if (pushButton?.id === undefined) {
      return
    }
    if (!pushButton?.hasIrData) {
      dispatch(snackBarShown({
        message: 'label.no_irdata',
        severity: 'warning'
      }))
      return
    }
    dispatch(pushButtonRequested({ buttonId: pushButton?.id }))
  }

  return (
    <Card sx={{ height: '130px', position: 'relative' }}>
      <LoadingLayer loading={isPushing} />
      <CardActionArea sx={{ height: '100%' }} onClick={onPush} disabled={isPushing}>
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
