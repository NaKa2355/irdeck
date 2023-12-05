// types
import { RemoteType } from '../../../type/remote'

// organisms
import { AddThermostatForm } from '../forms/addThermostatForm'

// conmponents
import { FormControl, FormLabel, Stack, Select, MenuItem, Grid, Button, type SelectChangeEvent, Alert, TextField, FormHelperText, Dialog, DialogTitle, DialogContent, Box } from '@mui/material'

// hooks
import { useTranslation } from 'react-i18next'
import { type Device } from '../../../type/device.type'
import { type AddRemoteReq } from '../../../interfaces/api'
import { type FormEventHandler, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addRemoteModalClosed, addRemoteModalStateSelector } from '../../../ducks/ui'

interface AddRemoteModalProps {
  devices?: Device[]
  submitFailed?: boolean
  isRemoteNameInvaild?: boolean
  remoteNameValidateErrorMessage?: string
  isOpen?: boolean
  close?: () => void
  onSubmit?: (req: AddRemoteReq) => void
  onRemoteNameInvaild?: () => void
}

export function AddRemoteModal (props: AddRemoteModalProps): JSX.Element {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const isOpen = useSelector(addRemoteModalStateSelector)
  const [remoteType, setRemoteType] = useState<RemoteType>(RemoteType.Button)

  const onClose = (): void => {
    dispatch(addRemoteModalClosed())
  }

  const remoteTypesItems: JSX.Element[] = Object.values(RemoteType).map((remoteType) => {
    return (
      <MenuItem key={remoteType} value={remoteType}>{t(`remote_types.${remoteType}`)}</MenuItem>
    )
  })

  const changeForm = (e: SelectChangeEvent<RemoteType>): void => {
    const remoteType = e.target.value as RemoteType
    setRemoteType(remoteType)
  }

  const deviceMenu = props.devices?.map((device) => {
    return (
      <MenuItem key={device.id} value={device.id}>{device.name}</MenuItem>
    )
  })

  const onSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    const form = new FormData(event.currentTarget)
    form.forEach((value, key) => {
      console.log(value, key)
    })
  }

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth>
      <DialogTitle>{t('header.add_remote')}</DialogTitle>
      <DialogContent>
        <Box height={20}></Box>

        <form id="add_remote_form" onSubmit={onSubmit}>
          <Stack spacing={2}>
            {(props.submitFailed ?? false) && (
              <Alert severity="error">
                {t('error.unknown')}
              </Alert>
            )}

            <FormControl>
              <FormLabel>{t('label.type')}</FormLabel>
              <Select name="type" value={remoteType} onChange={changeForm} defaultValue={remoteType}>
                {remoteTypesItems}
              </Select>
            </FormControl>

            <FormControl error={props.isRemoteNameInvaild}>
              <FormLabel>{t('label.name')}</FormLabel>
              <TextField
                name="name"
                error={props.isRemoteNameInvaild}
                placeholder={t('label.name') ?? ''}
                onChange={(e) => {
                  // changed remote name
                }}
              />
              <FormHelperText>
                {(props.isRemoteNameInvaild ?? false) ? t(props.remoteNameValidateErrorMessage ?? '') : ''}
              </FormHelperText>
            </FormControl>

            <FormControl>
              <FormLabel>{t('label.ir_sending_device')}</FormLabel>
              <Select
                defaultValue={props.devices?.at(0)?.id ?? ''}
                name="device_id"
                onChange={(e) => {
                  // cahnged devices
                }}
              >
                {deviceMenu}
              </Select>
            </FormControl>

            {remoteType === RemoteType.Thermostat &&
              <AddThermostatForm />
            }

            <Grid container direction="row" justifyContent="flex-end" alignItems="center">
              <Grid item>
                <Button
                  variant="contained"
                  type="submit">
                  {t('button.add')}
                </Button>
              </Grid>
            </Grid>
          </Stack>
        </form>
      </DialogContent>
    </Dialog>
  )
};
