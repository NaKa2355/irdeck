// types
import { RemoteType } from '../../type/remote'
import { type FormEventHandler } from 'react'
import { type AppDispatch } from '../../app/thunk'

// conmponents
import { FormControl, FormLabel, Stack, Select, MenuItem, Grid, Button, Alert, TextField, FormHelperText, Dialog, DialogTitle, DialogContent } from '@mui/material'
import { TempSlider } from '../monecules/tempSlider'

// hooks
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from '../../hooks'

// schemas
import { remoteNameValidator } from '../../schemas/remoteName'

// redux
import { addRemoteModalClosed, addRemoteModalStateSelector } from '../../ducks/ui'
import { devicesCanSendSelector } from '../../ducks/devices'
import { postRemoteStatusSelector } from '../../ducks/remotes'
import { postRemote } from '../../ducks/remotes/operations'
import { store } from '../../app'

interface FormData {
  remoteName: string
  remoteType: RemoteType
  deviceId: string
  scale: 0.5 | 1
  heatTempRange: [number, number]
  coolTempRange: [number, number]
}

const maxHeatTempRange: [number, number] = [0, 25]
const maxCoolTempRange: [number, number] = [10, 35]

const initialFormData: FormData = {
  remoteName: '',
  remoteType: RemoteType.Button,
  deviceId: '',
  scale: 0.5,
  coolTempRange: [10, 35],
  heatTempRange: [0, 25]
}

const AddRemoteForm = (): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()
  const postStatus = useSelector(postRemoteStatusSelector)
  const devicesCanSend = useSelector(devicesCanSendSelector)
  const [{ formData, validation }, { handleChange, handleChangeWithEvent, canSubmit }] = useForm<FormData>({
    initialFormData: {
      ...initialFormData,
      deviceId: devicesCanSend.at(0)?.id ?? ''
    },
    validators: {
      remoteName: remoteNameValidator
    }
  })
  const isUnknownError = postStatus.error?.code === 'unknown'

  const onSubmit: FormEventHandler = (e): void => {
    e.preventDefault()
    console.log(canSubmit())
    console.log(formData)
    if (!canSubmit()) {
      return
    }
    void (async () => {
      await dispatch(postRemote(formData))
      const status = postRemoteStatusSelector(store.getState())
      if (status.status === 'success') {
        dispatch(addRemoteModalClosed())
      }
    })()
  }

  const deviceMenu = devicesCanSend.map((device) => {
    return (
      <MenuItem key={device.id} value={device.id}>{device.name}</MenuItem>
    )
  })

  const scales = [0.5, 1]
  const scalesMenu = scales.map((scale) => {
    return (<MenuItem key={scale} value={scale}>{scale}</MenuItem>)
  })

  const remoteTypesItems: JSX.Element[] = Object.values(RemoteType).map((remoteType) => {
    return (
      <MenuItem key={remoteType} value={remoteType}>{t(`remote_types.${remoteType}`)}</MenuItem>
    )
  })

  return (
    <form onSubmit={onSubmit}>
      <Stack spacing={2}>
        {isUnknownError && (
          <Alert severity="error">
            {t('error.unknown')}
          </Alert>
        )}

        <FormControl>
          <FormLabel>{t('label.type')}</FormLabel>
          <Select
            name="type"
            value={formData.remoteType}
            onChange={handleChangeWithEvent('remoteType')}
            defaultValue={formData.remoteType}>
            {remoteTypesItems}
          </Select>
        </FormControl>

        <FormControl error={validation.remoteName?.isInvailed}>
          <FormLabel>{t('label.name')}</FormLabel>
          <TextField
            name="name"
            error={validation.remoteName?.isInvailed}
            placeholder={t('label.name') ?? ''}
            onChange={handleChangeWithEvent('remoteName')}
          />
          <FormHelperText>
            {t(validation.remoteName?.errorMessage ?? '')}
          </FormHelperText>
        </FormControl>

        <FormControl>
          <FormLabel>{t('label.ir_sending_device')}</FormLabel>
          <Select
            defaultValue={formData.deviceId}
            name="device_id"
            onChange={handleChangeWithEvent('deviceId')}
          >
            {deviceMenu}
          </Select>
        </FormControl>

        {formData.remoteType === RemoteType.Thermostat &&
          <Stack spacing={2}>
            <FormControl>
              <FormLabel>{t('label.scale')}</FormLabel>
              <Select
                name="scale"
                defaultValue={formData.scale}
                onChange={handleChangeWithEvent('scale')}
              >
                {scalesMenu}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>{t('label.cool')}</FormLabel>
              <TempSlider
                name="cool_temp_range"
                color="blue"
                tempRange={maxCoolTempRange}
                onChangeCommitted={handleChange('coolTempRange')}
              />
            </FormControl>

            <FormControl>
              <FormLabel>{t('label.heat')}</FormLabel>
              <TempSlider
                name="heat_temp_range"
                color="red"
                tempRange={maxHeatTempRange}
                onChangeCommitted={handleChange('heatTempRange')}
              />
            </FormControl>
          </Stack>
        }

        <Grid container direction="row" justifyContent="flex-end" alignItems="center">
          <Grid item>
            <Button
              variant="contained"
              type="submit"
              onClick={onSubmit}
            >
              {t('button.add')}
            </Button>
          </Grid>
        </Grid>
      </Stack>
    </form>
  )
}

export const AddRemoteModal = (): JSX.Element => {
  const isOpen = useSelector(addRemoteModalStateSelector)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const onClose = (): void => {
    dispatch(addRemoteModalClosed())
  }
  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth>
      <DialogTitle>{t('header.add_remote')}</DialogTitle>
      <DialogContent>
        <AddRemoteForm />
      </DialogContent>
    </Dialog>
  )
}
