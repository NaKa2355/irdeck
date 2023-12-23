// types
import { type FormEventHandler } from 'react'

// components
import { Alert, Box, Button, Dialog, DialogContent, DialogTitle, FormControl, FormHelperText, FormLabel, MenuItem, Select, Stack, TextField } from '@mui/material'

// hooks
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useUpdateRemoteApi, useDeleteRemoteApi } from '../../hooks/'
import { useForm } from '../../hooks'

// redux
import { editRemoteModalStateSelector, editRemoteModalClosed } from '../../ducks/ui'
import { devicesCanSendSelector } from '../../ducks/devices'

// schemas
import { remoteNameValidator } from '../../schemas/remoteName'

interface FormData {
  remoteName: string
  deviceId: string
}

const EditRemoteForm = (): JSX.Element => {
  const { t } = useTranslation()
  const { editingRemote } = useSelector(editRemoteModalStateSelector)
  const devicesCanSend = useSelector(devicesCanSendSelector)
  const [,{ deleteRemote }] = useDeleteRemoteApi()
  const [patchStatus, { updateRemote }] = useUpdateRemoteApi()
  const isUnknownError = patchStatus.error?.code === 'unknown'
  const [{ formData, validation }, { handleChangeWithEvent, canSubmit, setValidationError }] = useForm<FormData>({
    initialFormData: {
      remoteName: editingRemote?.name ?? '',
      deviceId: editingRemote?.deviceId ?? ''
    },
    validators: {
      remoteName: remoteNameValidator
    }
  })

  const onDeleteRemote = (): void => {
    void (async () => {
      await deleteRemote({
        remoteId: editingRemote?.id ?? ''
      })
    })()
  }

  const onSubmit: FormEventHandler = (e): void => {
    e.preventDefault()
    if (!canSubmit()) {
      return
    }
    void (async () => {
      const result = await updateRemote({
        remoteId: editingRemote?.id ?? '',
        ...formData
      })
      if (result.isError && result.error.code === 'remote_name_already_exists') {
        setValidationError('remoteName', 'error.remote_name_already_exists')
      }
    })()
  }

  const deviceMenu = devicesCanSend.map((device) => {
    return (
      <MenuItem key={device.id} value={device.id}>{device.name}</MenuItem>
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
            variant="contained"
            type="submit"
          >
            {t('button.done')}
          </Button>
        </Stack>
      </Stack>
    </form>
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
      <DialogTitle>{t('header.edit')}</DialogTitle>
      <DialogContent>
        <Box height={20}></Box>
        <EditRemoteForm />
      </DialogContent>
    </Dialog>
  )
}
