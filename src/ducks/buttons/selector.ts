import { createSelector } from '@reduxjs/toolkit'
import { type RootStore } from '../../app/store'
import { type ApiError } from '../../interfaces/api'
import { type Button } from '../../type/button'
import { type FetchStatus, type RequestStatus } from '../../utils/reqStatus'
import { selectedRemoteSelector } from '../remotes/selector'

const selectSelf = (state: RootStore): RootStore => state

export const buttonsSelector = createSelector(selectSelf, (state): (Button[] | undefined) => {
  const selectedRemote = selectedRemoteSelector(state)?.id
  if (selectedRemote === undefined) {
    return undefined
  }
  const buttonIds = state.buttons.domain.ids[selectedRemote]
  return buttonIds?.map((id) => state.buttons.domain.byId[id])
})

export const fetchButtonsStatusSelector = (remoteId: string): (state: RootStore) => FetchStatus<ApiError> | undefined => {
  return createSelector(selectSelf, (state) => {
    return state.buttons.fetchState.fetchStatus[remoteId]
  })
}

export const pushButtonStateSelector = (buttonId: string): (state: RootStore) => RequestStatus<ApiError> | undefined => {
  return createSelector(selectSelf, (state) => {
    return state.buttons.requestState.pushButtonStatus[buttonId]
  })
}
