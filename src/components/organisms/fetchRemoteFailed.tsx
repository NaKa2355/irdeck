import { Button, Stack, Typography } from '@mui/material'
import { IconWorldQuestion } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

interface FetchRemoteFailedProps {
  onRetry?: () => void
}

export const FetchRemoteFailed = (props: FetchRemoteFailedProps): JSX.Element => {
  const { t } = useTranslation()
  return (
    <Stack alignItems="center" spacing={2}>
      <Typography color="text.secondary">
        <IconWorldQuestion strokeWidth="1" size="100" />
      </Typography>
      <Typography color="text.secondary">
        {t('error.network')}
      </Typography>
      <Button variant='outlined' onClick={() => { props.onRetry?.() }}>
        {t('button.retry')}
      </Button>
    </Stack>
  )
}
