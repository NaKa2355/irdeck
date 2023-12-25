import { type ApiError } from '../../interfaces/api'
import { type RootStore } from '../../app/store'
import { type Remote } from '../../type/remote'
import { type RequestStatus, type FetchStatus } from '../../utils/reqStatus'
import { createSelector } from '@reduxjs/toolkit'

const selectSelf = (state: RootStore): RootStore => state

export const remotesSelector = createSelector(selectSelf,
  (state: RootStore): Remote[] => {
    const remote = state.remotes.domain
    return remote.ids.map(id => remote.byId[id])
  }
)

export const fetchRemoteStatusSelector = createSelector(
  selectSelf,
  (state: RootStore): FetchStatus<ApiError> => {
    return state.remotes.fetch.fetchStatus
  }
)

export const selectedRemoteSelector = createSelector(
  selectSelf,
  (state: RootStore): Remote | null => {
    const remoteId = state.remotes.selectedRemote.id
    if (remoteId === null) {
      return null
    }
    return state.remotes.domain.byId[remoteId]
  }
)

export const remoteSelector = (state: RootStore, remoteId: string): Remote | null => {
  return state.remotes.domain.byId[remoteId]
}

export const postRemoteStatusSelector = createSelector(
  selectSelf,
  (state: RootStore): RequestStatus<ApiError> => {
    return state.remotes.request.postRemoteStatus
  }
)

export const patchRemoteStatusSelector = createSelector(
  selectSelf,
  (state: RootStore): RequestStatus<ApiError> => {
    return state.remotes.request.patchRemoteStatus
  }
)

export const deleteRemoteStatusSelector = createSelector(
  selectSelf,
  (state: RootStore): RequestStatus<ApiError> => {
    return state.remotes.request.deleteRemoteStatus
  }
)
