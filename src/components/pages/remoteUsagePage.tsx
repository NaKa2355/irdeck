import { Box } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { RemoteUsageGrid } from '../organisms/remoteUsageGrid'
import React from 'react'

export const RemoteUsagePage: React.FC = () => {
  const { t } = useTranslation()
  return (
    <Box margin='15px'>
      <h2>{t('header.remotes')}</h2>
      <RemoteUsageGrid></RemoteUsageGrid>
    </Box>
  )
}
