// types
import React, { type FormEventHandler } from 'react'

// components
import { Alert, Box, Dialog, DialogContent, DialogTitle, FormControl, FormHelperText, FormLabel, MenuItem, Select, Stack, TextField } from '@mui/material'
import { LoadingButton } from '../atom/loadingButton'

// hooks
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from '../../hooks'

// redux
import { editRemoteModalStateSelector, editRemoteModalClosed } from '../../ducks/ui'
import { devicesCanSendSelector } from '../../ducks/devices'

// schemas
import { remoteNameValidator } from '../../schemas/remoteName'
import { clearPatchRemoteStatus, deleteRemoteRequested, deleteRemoteStatusSelector, patchRemoteRequested, patchRemoteStatusSelector } from '../../ducks/remotes'

interface FormData {
  remoteName: string
  deviceId: string
}

const EditRemoteForm: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { editingRemote } = useSelector(editRemoteModalStateSelector)
  const devicesCanSend = useSelector(devicesCanSendSelector)
  const deleteStatus = useSelector(deleteRemoteStatusSelector)
  const patchStatus = useSelector(patchRemoteStatusSelector)
  const isUnknownError = patchStatus.error?.code === 'unknown' || deleteStatus.error?.code === 'unknown'
  const [{ formData, validation }, { handleChangeWithEvent, canSubmit }] = useForm<FormData>({
    initialFormData: {
      remoteName: editingRemote?.name ?? '',
      deviceId: editingRemote?.deviceId ?? ''
    },
    validators: {
      remoteName: remoteNameValidator
    },
    serverSideValidation: {
      remoteName: {
        isInvailed: patchStatus.status === 'failed',
        errorMessage: patchStatus.error?.code === 'remote_name_already_exists' ? 'error.remote_name_already_exists' : '',
        onCleanup: () => {
          dispatch(clearPatchRemoteStatus())
        }
      }
    }
  })

  const onDeleteRemote = (): void => {
    dispatch(deleteRemoteRequested({
      remoteId: editingRemote?.id ?? ''
    }))
  }

  const onSubmit: FormEventHandler = (e): void => {
    e.preventDefault()
    if (!canSubmit()) {
      return
    }
    dispatch(patchRemoteRequested({
      remoteId: editingRemote?.id ?? '',
      ...formData
    }))
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
          <LoadingButton
            variant="contained"
            onClick={onDeleteRemote}
            color="error"
            loading={deleteStatus.status === 'pending'}
          >
            {t('button.delete')}
          </LoadingButton>
          <LoadingButton
            variant="contained"
            type="submit"
            loading={patchStatus.status === 'pending'}
          >
            {t('button.done')}
          </LoadingButton>
        </Stack>
      </Stack>
    </form>
  )
}

export const EditRemoteModal: React.FC = () => {
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
