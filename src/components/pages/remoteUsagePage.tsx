import { Box } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { RemoteUsageGrid } from '../organisms/remoteUsageGrid'
import React from 'react'
import { NoRemotes } from '../organisms/no_remotes'
import { useSelector } from 'react-redux'
import { fetchRemotesStatusSelector, selectedRemoteIdSelector } from '../../ducks/remotes'
import { LoadingRemotes } from '../organisms/loading_remotes'

export const RemoteUsagePage: React.FC = React.memo(() => {
  const { t } = useTranslation()
  const fetchRemotesStatus = useSelector(fetchRemotesStatusSelector)
  const selectedRemoteId = useSelector(selectedRemoteIdSelector)
  return (
    <Box margin='15px'>
      <h2>{t('header.remotes')}</h2>
      {!fetchRemotesStatus.isCached &&
          <LoadingRemotes />
      }
      {fetchRemotesStatus.isCached && selectedRemoteId === undefined &&
        <NoRemotes />
      }
      <RemoteUsageGrid></RemoteUsageGrid>
    </Box>
  )
})
