import { type ApiError } from '../../interfaces/api'
import { type RootStore } from '../../app/store'
import { type Remote } from '../../type/remote'
import { type RequestStatus, type FetchStatus } from '../../utils/reqStatus'

export const remotesSelector = (state: RootStore): Remote[] => {
  const remote = state.remotes.domain
  return remote.ids.map(id => remote.byId[id])
}

export const fetchRemoteStatusSelector = (state: RootStore): FetchStatus<ApiError> => {
  return state.remotes.fetch.fetchStatus
}

export const selectedRemoteSelector = (state: RootStore): string | null => {
  return state.remotes.selectedRemote.id
}

export const remoteSelector = (state: RootStore, remoteId: string): Remote | null => {
  return state.remotes.domain.byId[remoteId]
}

export const postRemoteStatusSelector = (state: RootStore): RequestStatus<ApiError> => {
  return state.remotes.request.postRemoteStatus
}
