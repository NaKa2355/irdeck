import { Button, Stack, Typography } from '@mui/material'
import { IconDeviceRemote } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { addRemoteModalOpened } from '../../ducks/ui'

export const NoRemotes = (): JSX.Element => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const onClick = (): void => {
    dispatch(addRemoteModalOpened())
  }
  return (
    <Stack alignItems="center" spacing={2}>
      <Typography color="text.secondary">
        <IconDeviceRemote strokeWidth="1" size="100" />
      </Typography>
      <Typography color="text.secondary">
        {t('label.no_remotes')}
      </Typography>
      <Button variant='outlined' onClick={onClick}>
        {t('button.add')}
      </Button>
    </Stack>
  )
}
