// components
import { IconAlertCircle, IconCheck, IconDeviceRemote, IconHourglassLow, IconWifi } from '@tabler/icons-react'
import { Select, Button, FormControl, FormLabel, Grid, MenuItem, Stack, Typography, type SelectChangeEvent, CircularProgress, Box, Dialog, DialogTitle, DialogContent } from '@mui/material'

// redux
import { learnIrModalClosed } from '../../ducks/ui/leanIrModal'
import { learnIrModalStateSelector } from '../../ducks/ui'
import { devicesCanReceiveSelector, receiveIrRequested, sendIrDataRequested } from '../../ducks/devices'
import { receiveIrDataStatusSelector, receivedIrDataSelector } from '../../ducks/devices/selector'

// hooks
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

// types
import { type RequestStatus } from '../../utils/reqStatus'
import { type ApiError } from '../../interfaces/api'
import { type Device } from '../../type/device.type'
import { type AppDispatch } from '../../app/thunk'
import { clearLearnIrDataStatus, learnIrDataRequested } from '../../ducks/buttons/requestStateSlice'

interface ReceiveIrErrorViewProps {
  onCancel: () => void
  onRetry: () => void
}

const ReceiveIrErrorView = (props: ReceiveIrErrorViewProps): JSX.Element => {
  const { t } = useTranslation()

  return (
    <Stack spacing={2}>
      <Typography color="error.light" align="center">
        <IconAlertCircle size={100} stroke={'1px'} />
      </Typography>
      <Typography align="center" fontWeight="bold">Receive Faild</Typography>
      <Button variant="outlined" onClick={props.onCancel}>
        {t('button.cancel')}
      </Button>
      <Button variant="contained" onClick={props.onRetry}>
        {t('button.retry')}
      </Button>
    </Stack>
  )
}

interface ReceivingIrViewProps {
  onLoad?: () => void
  onCancel: () => void
}

const ReceivingIrView = (props: ReceivingIrViewProps): JSX.Element => {
  const { t } = useTranslation()
  return (
    <Stack spacing={2}>
      <Grid
        paddingTop={2}
        container
        direction="row"
        justifyContent="center"
        alignItems="center">
        <Grid item>
          <CircularProgress />
        </Grid>
      </Grid>
      <Button variant="outlined" onClick={props.onCancel}>
        {t('button.cancel')}
      </Button>
    </Stack>
  )
}

interface ReceiveIRSuccessfulViewProps {
  onTest: () => void
  onRetry: () => void
  onDone: () => void
}

const ReceiveIRSuccessfulView = (props: ReceiveIRSuccessfulViewProps): JSX.Element => {
  const { t } = useTranslation()

  return (
    <Stack spacing={2}>
      <Grid container direction="row" justifyContent="center" alignItems="center" >
        <Grid item>
          <Typography color="success.light">
            <IconCheck size={100} stroke={'1px'} />
          </Typography>
        </Grid>
      </Grid>
      <Typography align="center" fontWeight="bold">{t('label.success')}</Typography>

      <Stack direction="row" spacing={2}>
        <Button
          fullWidth
          variant="outlined"
          onClick={props.onTest}
        >
          {t('button.receiving_test')}
        </Button>

        <Button
          fullWidth
          variant="outlined"
          onClick={props.onRetry}
        >
          {t('button.retry')}
        </Button>
      </Stack>
      <Button variant="contained" onClick={props.onDone}>
        {t('button.done')}
      </Button>
    </Stack>
  )
}

interface ReceiveIrTimeOutViewProps {
  onCancel: () => void
  onRetry: () => void
}

const ReceiveIrTimeOutView = (props: ReceiveIrTimeOutViewProps): JSX.Element => {
  const { t } = useTranslation()

  return (
    <Stack spacing={2}>
      <Grid container direction="row" justifyContent="center" alignItems="center" >
        <Grid item>
          <Stack>
            <Typography color="text.secondary">
              <IconHourglassLow size={100} stroke={'1px'} />
            </Typography>
            <Typography align="center" fontWeight="bold">{t('label.timeout')}</Typography>
          </Stack>
        </Grid>
      </Grid>

      <Button variant="outlined" onClick={props.onCancel}>
        {t('button.cancel')}
      </Button>
      <Button variant="contained" onClick={props.onRetry}>
        {t('button.retry')}
      </Button>
    </Stack>
  )
}

interface ReceiveIrViewProps {
  devicesCanReceive: Device[]
  onCancel: () => void
  onDeviceComitted: (deviceId: string) => void
}

const SelectDeviceView = (props: ReceiveIrViewProps): JSX.Element => {
  const { t } = useTranslation()
  const initialDeviceId = props.devicesCanReceive.at(0)?.id ?? ''
  const [selectedDevice, selectDevice] = useState(initialDeviceId)
  const devicesItem = props.devicesCanReceive.map((device) => {
    return (<MenuItem key={device.id} value={device.id}>{device.name}</MenuItem>)
  })

  const onDeviceIdCommited = (): void => {
    props.onDeviceComitted(selectedDevice)
  }

  const onDeviceIdChange = (e: SelectChangeEvent): void => {
    selectDevice(e.target.value)
  }

  return (
    <Stack spacing={2}>
      <Grid container direction="row" justifyContent="center" alignItems="center" >
        <Grid item>
          <Typography color="text.secondary">
            <IconWifi size={100} stroke={'1px'} />
          </Typography>
          <Typography color="text.secondary">
            <IconDeviceRemote size={100} stroke={'1px'} />
          </Typography>
        </Grid>
      </Grid>
      <FormControl>
        <FormLabel>{t('label.ir_receiving_device')}</FormLabel>
        <Select
          defaultValue={selectedDevice}
          onChange={onDeviceIdChange}
        >
          {devicesItem}
        </Select>
      </FormControl>
      <Button variant="outlined" onClick={props.onCancel}>
        {t('button.cancel')}
      </Button>

      <Button
        variant="contained"
        onClick={onDeviceIdCommited}>
        {t('button.receive')}
      </Button>
    </Stack>
  )
}

const computeStatus = (deviceId: string | null, status: RequestStatus<ApiError> | undefined):
'standby' | 'success' | 'failed' | 'timeout' | 'receiving' => {
  if (deviceId === null) {
    return 'standby'
  }
  if (status?.status === 'pending') {
    return 'receiving'
  }
  if (status?.status === 'failed') {
    if (status.error?.code === 'timeout') {
      return 'timeout'
    }
    return 'failed'
  }
  if (status?.status === 'success') {
    return 'success'
  }
  return 'standby'
}

export const ReceiveIrView = (): JSX.Element => {
  const [deviceId, setDeviceId] = useState<string | null>(null)
  const dispatch = useDispatch<AppDispatch>()
  const receivedIrData = useSelector(receivedIrDataSelector(deviceId ?? ''))
  const modalState = useSelector(learnIrModalStateSelector)
  const devicesCanReceive = useSelector(devicesCanReceiveSelector)
  const receiveIrDataStatus = useSelector(receiveIrDataStatusSelector(deviceId ?? ''))
  const status = computeStatus(deviceId, receiveIrDataStatus)

  const onDeviceComitted = (deviceId: string): void => {
    setDeviceId(deviceId)
    dispatch(receiveIrRequested({ deviceId }))
    dispatch(clearLearnIrDataStatus())
  }

  const onCancel = (): void => {
    dispatch(learnIrModalClosed())
  }

  const onRetry = (): void => {
    dispatch(receiveIrRequested({
      deviceId: deviceId ?? ''
    }))
  }

  const onDone = (): void => {
    dispatch(learnIrDataRequested({
      remoteId: modalState.remote?.id ?? '',
      buttonId: modalState.button?.id ?? '',
      irData: receivedIrData
    }))
  }

  const onTest = (): void => {
    dispatch(sendIrDataRequested({
      deviceId: modalState.remote?.deviceId ?? ''
    }))
  }

  return (
    <Box>
      {status === 'standby' && (
        <SelectDeviceView
          devicesCanReceive={devicesCanReceive}
          onCancel={onCancel}
          onDeviceComitted={onDeviceComitted}
        />
      )}

      {status === 'receiving' && (
        <ReceivingIrView
          onCancel={onCancel}
        />
      )}

      {status === 'success' && (
        <ReceiveIRSuccessfulView
          onDone={onDone}
          onRetry={onRetry}
          onTest={onTest} />
      )}

      {status === 'failed' && (
        <ReceiveIrErrorView
          onCancel={onCancel}
          onRetry={onRetry}
        />

      )}

      {status === 'timeout' && (
        <ReceiveIrTimeOutView
          onCancel={onCancel}
          onRetry={onRetry}
        />
      )}
    </Box>
  )
}

export const ReceiveIrModal = (): JSX.Element => {
  const { t } = useTranslation()
  const modalState = useSelector(learnIrModalStateSelector)
  const dispatch = useDispatch()
  const onClose = (): void => {
    dispatch(learnIrModalClosed())
  }

  return (
    <Dialog open={modalState.isOpen} onClose={onClose} fullWidth>
      <DialogTitle>{t('header.add_remote')}</DialogTitle>
      <DialogContent>
        <Box height={20}></Box>
        <ReceiveIrView />
      </DialogContent>
    </Dialog>
  )
}
