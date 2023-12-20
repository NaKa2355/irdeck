// types
// organisms
import { Alert, Box, Button, Dialog, DialogContent, DialogTitle, FormControl, FormHelperText, FormLabel, MenuItem, Select, Stack, TextField } from '@mui/material'

// hooks
import { useTranslation } from 'react-i18next'
import { type Device } from '../../../type/device.type'
import { type EditRemoteReq } from '../../../interfaces/api'
import { useDispatch, useSelector } from 'react-redux'
import { editRemoteModalStateSelector, editRemoteModalClosed } from '../../../ducks/ui'
import { devicesCanSendSelector } from '../../../ducks/devices'

interface EditRemoteModalProps {
  devicesCanSend?: Device[]
  postError?: boolean
  remoteName?: string
  deviceId?: string
  isRemoteNameInvaild?: boolean
  remoteNameValidateErrorMessage?: string
  isOpen?: boolean
  close?: () => void
  onDelete?: () => void
  onSubmit?: (req: EditRemoteReq) => void
}

export function EditRemoteModal (props: EditRemoteModalProps): JSX.Element {
  const { t } = useTranslation()
  const { isOpen, editingRemote } = useSelector(editRemoteModalStateSelector)
  const devicesCanSend = useSelector(devicesCanSendSelector)
  const dispatch = useDispatch()

  const deviceMenu = devicesCanSend.map((device) => {
    return (
      <MenuItem key={device.id} value={device.id}>{device.name}</MenuItem>
    )
  })

  const onClose = (): void => {
    dispatch(editRemoteModalClosed())
  }

  const deleteRemote = (): void => {
    dispatch(editRemoteModalClosed())
  }

  const submit = (): void => {
  }

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth>
      <DialogTitle>{t('header.add_remote')}</DialogTitle>
      <DialogContent>
        <Box height={20}></Box>
        <form>
          <Stack spacing={2}>
            {(props.postError ?? false) && (
              <Alert severity="error">
                {t('error.unknown')}
              </Alert>
            )}
            <FormControl error={props.isRemoteNameInvaild}>
              <FormLabel>{t('label.name')}</FormLabel>
              <TextField
                name="name"
                error={props.isRemoteNameInvaild}
                defaultValue={editingRemote?.name ?? ''}
                placeholder={t('label.name') ?? ''}
                onChange={(e) => {
                  // remote name changed
                }}
              />
              <FormHelperText>
                {(props.isRemoteNameInvaild ?? false) ? t(props.remoteNameValidateErrorMessage ?? '') : ''}
              </FormHelperText>
            </FormControl>

            <FormControl>
              <FormLabel>{t('label.ir_sending_device')}</FormLabel>
              <Select
                name="device"
                onChange={() => {
                  // device changed
                }}
                defaultValue={editingRemote?.deviceId}>
                {deviceMenu}
              </Select>
            </FormControl>

            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={2}
            >
              <Button
                variant="contained"
                onClick={deleteRemote}
                color="error"
              >
                {t('button.delete')}
              </Button>
              <Button
                onClick={submit}
                variant="contained"
                type="submit">
                {t('button.done')}
              </Button>
            </Stack>
          </Stack>
        </form>
      </DialogContent>
    </Dialog>
  )
}
