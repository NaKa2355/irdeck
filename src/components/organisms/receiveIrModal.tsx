import { IconAlertCircle, IconCheck, IconDeviceRemote, IconHourglassLow, IconWifi } from '@tabler/icons-react'
import { useState } from 'react'
import { type Device } from '../../type/device.type'
import { useTranslation } from 'react-i18next'
import { Select, Button, FormControl, FormLabel, Grid, MenuItem, Stack, Typography, type SelectChangeEvent, CircularProgress, Box } from '@mui/material'

interface ReceiveIrErrorViewProps {
  onCancel: () => void
  onRetry: () => void
}

function ReceiveIrErrorView (props: ReceiveIrErrorViewProps): JSX.Element {
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

function ReceivingIrView (props: ReceivingIrViewProps): JSX.Element {
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
  onTest: () => Promise<void>
  onRetry: () => void
  onDone: () => void
}

function ReceiveIRSuccessfulView (props: ReceiveIRSuccessfulViewProps): JSX.Element {
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

function ReceiveIrTimeOutView (props: ReceiveIrTimeOutViewProps): JSX.Element {
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
  onReceive: (deviceId: string) => void
}

function ReceiveIrView (props: ReceiveIrViewProps): JSX.Element {
  const { t } = useTranslation()
  const [deviceId, setDeviceId] = useState<string | undefined>(props.devicesCanReceive.at(0)?.id)

  const receive = (): void => {
    if (deviceId !== undefined) {
      props.onReceive(deviceId)
    }
  }

  const onDeviceSelected = (e: SelectChangeEvent): void => {
    const deviceId = e.target.value
    setDeviceId(deviceId)
  }

  const devicesItem = props.devicesCanReceive.map((device) => {
    return (<MenuItem key={device.id} value={device.id}>{device.name}</MenuItem>)
  })

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
          value={deviceId ?? ''}
          onChange={onDeviceSelected}
        >
          {devicesItem}
        </Select>
      </FormControl>
      <Button variant="outlined" onClick={props.onCancel}>
        {t('button.cancel')}
      </Button>

      <Button
        variant="contained"
        onClick={receive}>
        {t('button.receive')}
      </Button>
    </Stack>
  )
}

interface ReceiveIrModalProps {
  devicesCanReceive: Device[]
  state: 'standby' | 'receiving' | 'timeout' | 'failed' | 'success'
  onCancel: () => void
  onClose: () => void
  onDone: () => void
  onSendIr: () => void
  onRetry: () => void
  onReceiveIr: () => void
}

export function ReceiveIrModal (props: ReceiveIrModalProps): JSX.Element {
  const cancel = (): void => {
    props.onClose()
  }

  return (
    <Box>
      {props.state === 'standby' && (
        <ReceiveIrView
          devicesCanReceive={props.devicesCanReceive}
          onCancel={cancel}
          onReceive={() => {
            props.onReceiveIr()
          }}
        />
      )}

      {props.state === 'receiving' && (
        <ReceivingIrView
          onCancel={cancel}
        />
      )}

      {props.state === 'success' && (
        <ReceiveIRSuccessfulView
          onDone={props.onDone}
          onRetry={props.onRetry}
          onTest={async () => {
            props.onSendIr()
          }} />
      )}

      {props.state === 'failed' && (
        <ReceiveIrErrorView
          onCancel={cancel}
          onRetry={props.onRetry}
        />

      )}

      {props.state === 'timeout' && (
        <ReceiveIrTimeOutView
          onCancel={cancel}
          onRetry={props.onRetry}
        />
      )}
    </Box>
  )
}
