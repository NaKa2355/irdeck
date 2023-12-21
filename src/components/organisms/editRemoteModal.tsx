// types
import { type AppDispatch } from '../../app/thunk'

// organisms
import { Alert, Box, Button, Dialog, DialogContent, DialogTitle, FormControl, FormHelperText, FormLabel, MenuItem, Select, Stack, TextField } from '@mui/material'

// hooks
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

// redux
import { editRemoteModalStateSelector, editRemoteModalClosed } from '../../ducks/ui'
import { devicesCanSendSelector } from '../../ducks/devices'
import { deleteRemote, patchRemote, patchRemoteStatusSelector } from '../../ducks/remotes'
import { remoteNameValidator } from '../../schemas/remoteName'
import { store } from '../../app'
import { useForm } from '../../hooks'
import { useEffect } from 'react'

interface FormData {
  remoteName: string
  deviceId: string
}

const EditRemoteForm = (): JSX.Element => {
  const { t } = useTranslation()
  const { editingRemote } = useSelector(editRemoteModalStateSelector)
  const devicesCanSend = useSelector(devicesCanSendSelector)
  const patchStatus = useSelector(patchRemoteStatusSelector)
  const isUnknownError = patchStatus.error?.code === 'unknown'
  const dispatch = useDispatch<AppDispatch>()
  const [{ formData, validation }, { handleChangeWithEvent, canSubmit }] = useForm<FormData>({
    initialFormData: {
      remoteName: editingRemote?.name ?? '',
      deviceId: editingRemote?.deviceId ?? ''
    },
    validators: {
      remoteName: remoteNameValidator
    }
  })

  useEffect(() => {
    if (patchStatus.status === 'success') {
      dispatch(editRemoteModalClosed())
    }
  }, [patchStatus])

  const onDeleteRemote = (): void => {
    void (async () => {
      await dispatch(deleteRemote({
        remoteId: editingRemote?.id ?? ''
      }))
      dispatch(editRemoteModalClosed())
    })()
  }

  const submit = (): void => {
    if (!canSubmit()) {
      return
    }
    void (async () => {
      await dispatch(patchRemote({
        ...formData,
        remoteId: editingRemote?.id ?? ''
      }))
      const status = patchRemoteStatusSelector(store.getState())
      if (status.status === 'success') {
        dispatch(editRemoteModalClosed())
      }
    })()
  }

  const deviceMenu = devicesCanSend.map((device) => {
    return (
      <MenuItem key={device.id} value={device.id}>{device.name}</MenuItem>
    )
  })

  return (
    <Stack spacing={2}>
      {isUnknownError && (
        <Alert severity="error">
          {t('error.unknown')}
        </Alert>
      )}
      <FormControl error={validation.remoteName?.isInvailed}>
        <FormLabel>{t('label.name')}</FormLabel>
        <TextField
          name="name"
          error={validation.remoteName?.isInvailed}
          defaultValue={formData.remoteName}
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
          name="device"
          onChange={handleChangeWithEvent('deviceId')}
          defaultValue={formData.deviceId}>
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
          onClick={onDeleteRemote}
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
  )
}

export const EditRemoteModal = (): JSX.Element => {
  const { t } = useTranslation()
  const { isOpen } = useSelector(editRemoteModalStateSelector)
  const dispatch = useDispatch()

  const onClose = (): void => {
    dispatch(editRemoteModalClosed())
  }
  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth>
      <DialogTitle>{t('header.add_remote')}</DialogTitle>
      <DialogContent>
        <Box height={20}></Box>
        <EditRemoteForm />
      </DialogContent>
    </Dialog>
  )
}
