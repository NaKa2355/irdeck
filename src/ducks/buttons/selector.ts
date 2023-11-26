import { type ApiError } from '../../interfaces/api'
import { type RootStore } from '../../store/store'
import { type Button } from '../../type/button'
import { type FetchStatus, type PostStatus } from '../../utils/reqStatus'

export const selectButtons = (state: RootStore): Button[] => {
  return state.buttons.domianData.ids[state.remotes.appData.selectedRemoteId ?? ''].map((id) => {
    return state.buttons.domianData.byIds[id]
  })
}

interface ButtonsState {
  postingStatus: Record<string, {
    pushButton: PostStatus<ApiError> | undefined
    settingIrData: PostStatus<ApiError> | undefined
  }>
  fetchingStatus: FetchStatus<ApiError> | undefined
}

export const selectButtonsState = (state: RootStore): ButtonsState => {
  return {
    postingStatus: state.buttons.appData.postingStatus,
    fetchingStatus: state.buttons.appData.fetchingStatus[state.remotes.appData.selectedRemoteId ?? '']
  }
}
