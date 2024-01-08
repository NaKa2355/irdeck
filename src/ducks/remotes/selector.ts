import { type ApiError } from '../../interfaces/api'
import { type RootStore } from '../../app/store'
import { type Remote } from '../../type/remote'
import { type FetchStatus, type RequestStatus } from '../../utils/reqStatus'
import { createSelector } from '@reduxjs/toolkit'

export const remotesSelector = createSelector(
  (state: RootStore) => state.remotes.domain.ids,
  (state: RootStore) => state.remotes.domain.byId,
  (ids, byId): Remote[] => {
    return ids.map(id => byId[id])
  }
)

export const fetchRemotesStatusSelector = createSelector(
  (state: RootStore) => state.remotes.fetch.fetchStatus.remotes,
  (status: FetchStatus<ApiError>) => status
)

export const selectedRemoteIdSelector = createSelector(
  (state: RootStore) => state.remotes.selectedRemote.id,
  (remoteId) => {
    return remoteId
  }
)

export const remoteSelector = (remoteId: string | undefined): (state: RootStore) => Remote | undefined => {
  return (state) => {
    if (remoteId === undefined) {
      return undefined
    }
    return state.remotes.domain.byId[remoteId]
  }
}

export const postRemoteStatusSelector = createSelector(
  (state: RootStore) => state.remotes.request.postRemoteStatus,
  (status: RequestStatus<ApiError>) => status
)

export const patchRemoteStatusSelector = createSelector(
  (state: RootStore) => state.remotes.request.patchRemoteStatus,
  (status: RequestStatus<ApiError>) => status
)

export const deleteRemoteStatusSelector = createSelector(
  (state: RootStore) => state.remotes.request.deleteRemoteStatus,
  (status: RequestStatus<ApiError>) => status
)
