import { type ApiError } from '../../interfaces/api'
import { type RootStore } from '../../store/store'
import { type Button } from '../../type/button'
import { type FetchStatus, type RequestStatus } from '../../utils/reqStatus'

export const selectButtons = (state: RootStore): Button[] => {
  return state.buttons.domianData.ids[state.remotes.appData.selectedRemoteId ?? ''].map((id) => {
    return state.buttons.domianData.byIds[id]
  })
}

interface ButtonsState {
  requestStatus: Record<string, {
    pushButton: RequestStatus<ApiError>
    patchIrData: RequestStatus<ApiError>
  } | undefined>
  fetchingStatus: FetchStatus<ApiError> | undefined
}

export const selectButtonsState = (state: RootStore): ButtonsState => {
  return {
    requestStatus: state.buttons.appData.requestStatus,
    fetchingStatus: state.buttons.appData.fetchStatus[state.remotes.appData.selectedRemoteId ?? '']
  }
}
