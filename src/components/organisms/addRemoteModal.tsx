// types
import { RemoteType } from '../../type/remote'

// conmponents
import { FormControl, FormLabel, Stack, Select, MenuItem, Grid, Button, type SelectChangeEvent, Alert, TextField, FormHelperText, Dialog, DialogTitle, DialogContent, Box } from '@mui/material'

// hooks
import { useTranslation } from 'react-i18next'
import { useState, type ChangeEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addRemoteModalClosed, addRemoteModalStateSelector } from '../../ducks/ui'
import { devicesCanSendSelector } from '../../ducks/devices'
import { TempSlider } from '../monecules/tempSlider'
import { type InputItemState } from '../../utils/inputItemState'
import { postRemote } from '../../ducks/remotes/operations'
import { type AppDispatch } from '../../app/thunk'
import { postRemoteStatusSelector } from '../../ducks/remotes'

interface FormData {
  remoteName: InputItemState<string, string>
  remoteType: RemoteType
  deviceId: string
  scale: 0.5 | 1
  heatTempRange: [number, number]
  coolTempRange: [number, number]
}

const maxHeatTempRange: [number, number] = [0, 25]
const maxCoolTempRange: [number, number] = [10, 35]

const initialFormData: FormData = {
  remoteName: {
    state: '',
    isInvaild: false
  },
  remoteType: RemoteType.Button,
  deviceId: '',
  scale: 0.5,
  coolTempRange: [10, 35],
  heatTempRange: [0, 25]
}

export const AddRemoteModal = (): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()
  const postStatus = useSelector(postRemoteStatusSelector)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const remoteNameValidation = {
    isInvaild: formData.remoteName.isInvaild,
    errorMessage: formData.remoteName.isInvaild ? formData.remoteName.errorMessage : ''
  }
  const isOpen = useSelector(addRemoteModalStateSelector)
  const devicesCanSend = useSelector(devicesCanSendSelector)

  const onClose = (): void => {
    dispatch(addRemoteModalClosed())
  }

  const onRemoteTypeChange = (e: SelectChangeEvent<RemoteType>): void => {
    const newRemoteType = e.target.value as RemoteType
    setFormData({
      ...formData,
      remoteType: newRemoteType
    })
  }

  const onRemoteNameChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const remoteName: InputItemState<string, string> = {
      isInvaild: false,
      state: e.target.value
    }
    setFormData({
      ...formData,
      remoteName
    })
  }

  const onDeviceChange = (e: SelectChangeEvent<string>): void => {
    const newDeviceId = e.target.value
    setFormData({
      ...formData,
      deviceId: newDeviceId
    })
  }

  const onScalseChange = (e: SelectChangeEvent<0.5 | 1>): void => {
    const newScale = e.target.value as 0.5 | 1
    setFormData({
      ...formData,
      scale: newScale
    })
  }

  const onCoolTempRangeChange = (value: [number, number]): void => {
    setFormData({
      ...formData,
      coolTempRange: value
    })
  }

  const onHeatTempRangeChange = (value: [number, number]): void => {
    setFormData({
      ...formData,
      heatTempRange: value
    })
  }

  const onSubmit = (): void => {
    void (async () => {
      await dispatch(postRemote({
        remoteName: formData.remoteName.state,
        deviceId: formData.deviceId,
        remoteType: formData.remoteType,
        scale: formData.scale,
        coolTempRange: formData.coolTempRange,
        heatTempRange: formData.heatTempRange
      }))
      console.log(postStatus)
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
    <Dialog open={isOpen} onClose={onClose} fullWidth>
      <DialogTitle>{t('header.add_remote')}</DialogTitle>
      <DialogContent>
        <Box height={20}></Box>

        <Stack spacing={2}>
          {(false) && (
            <Alert severity="error">
              {t('error.unknown')}
            </Alert>
          )}

          <FormControl>
            <FormLabel>{t('label.type')}</FormLabel>
            <Select
              name="type"
              value={formData.remoteType}
              onChange={onRemoteTypeChange}
              defaultValue={formData.remoteType}>
              {remoteTypesItems}
            </Select>
          </FormControl>

          <FormControl error={remoteNameValidation.isInvaild}>
            <FormLabel>{t('label.name')}</FormLabel>
            <TextField
              name="name"
              error={remoteNameValidation.isInvaild}
              placeholder={t('label.name') ?? ''}
              onChange={onRemoteNameChange}
            />
            <FormHelperText>
              {t(remoteNameValidation.errorMessage)}
            </FormHelperText>
          </FormControl>

          <FormControl>
            <FormLabel>{t('label.ir_sending_device')}</FormLabel>
            <Select
              defaultValue={devicesCanSend.at(0)?.id ?? ''}
              name="device_id"
              onChange={onDeviceChange}
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
                  defaultValue={0.5}
                  onChange={onScalseChange}
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
                  onChangeCommitted={onCoolTempRangeChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>{t('label.heat')}</FormLabel>
                <TempSlider
                  name="heat_temp_range"
                  color="red"
                  tempRange={maxHeatTempRange}
                  onChangeCommitted={onHeatTempRangeChange}
                />
              </FormControl>
            </Stack>
          }

          <Grid container direction="row" justifyContent="flex-end" alignItems="center">
            <Grid item>
              <Button
                variant="contained"
                onClick={onSubmit}
              >
                {t('button.add')}
              </Button>
            </Grid>
          </Grid>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
