import { type ApiError } from '../../interfaces/api'
import { type RootStore } from '../../store/store'
import { type Remote } from '../../type/remote'
import { type FetchStatus, type PostStatus } from '../../utils/reqStatus'

export const selectRemotes = (state: RootStore): Remote[] => {
  return state.remotes.domainData.ids.map((id) => {
    return state.remotes.domainData.byId[id]
  })
}

export interface RemoteState {
  fetchStatus: FetchStatus<ApiError>
  postNewRemoteStatus: PostStatus<ApiError>
  postEditedRemoteStatus: PostStatus<ApiError>
  postDeletedRemoteStatus: PostStatus<ApiError>
}

export const selectRemoteState = (state: RootStore): RemoteState => {
  return {
    ...state.remotes.appData
  }
}

export const selectSelectedRemoteId = (state: RootStore): string | undefined => {
  return state.remotes.appData.selectedRemoteId
}
