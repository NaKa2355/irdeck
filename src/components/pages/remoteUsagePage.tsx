import { Box } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { RemoteUsageGrid } from '../organisms/remoteUsageGrid'
import React from 'react'
import { NoRemotes } from '../organisms/no_remotes'
import { useDispatch, useSelector } from 'react-redux'
import { fetchRemotesStatusSelector, selectedRemoteIdSelector } from '../../ducks/remotes'
import { LoadingRemotes } from '../organisms/loading_remotes'
import { FetchRemoteFailed } from '../organisms/fetchRemoteFailed'
import { fetchRemotesRequested } from '../../ducks/remotes/fetchStateSlice'

export const RemoteUsagePage: React.FC = React.memo(() => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const fetchRemotesStatus = useSelector(fetchRemotesStatusSelector)
  const selectedRemoteId = useSelector(selectedRemoteIdSelector)
  return (
    <Box margin='15px'>
      <h2>{t('header.remotes')}</h2>
      {!fetchRemotesStatus.isCached && fetchRemotesStatus.isFetching &&
        <LoadingRemotes />
      }
      {fetchRemotesStatus.isFetchFailed &&
        <FetchRemoteFailed onRetry={() => dispatch(fetchRemotesRequested())} />
      }
      {fetchRemotesStatus.isCached && selectedRemoteId === undefined &&
        <NoRemotes />
      }
      <RemoteUsageGrid></RemoteUsageGrid>
    </Box>
  )
})
