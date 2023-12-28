import { createSelector } from '@reduxjs/toolkit'
import { type RootStore } from '../../app/store'
import { type ApiError } from '../../interfaces/api'
import { type ButtonId, type Button } from '../../type/button'
import { type FetchStatus, type RequestStatus } from '../../utils/reqStatus'
import { type RemoteId } from '../../type/remote'

const selectSelf = (state: RootStore): RootStore => state

export const buttonsSelector = (remoteId: RemoteId | undefined): (state: RootStore) => Button[] | undefined => {
  return (state) => {
    if (remoteId === undefined) {
      return undefined
    }
    const buttonIds = state.buttons.domain.ids[remoteId]
    if (buttonIds === undefined) {
      return undefined
    }
    const buttons = new Array<Button>(buttonIds.length)
    for (let i = 0; i < buttonIds.length; i++) {
      buttons[i] = state.buttons.domain.byId[buttonIds[i]]
    }
    return buttons
  }
}

export const fetchButtonsStatusSelector = (remoteId: RemoteId): (state: RootStore) => FetchStatus<ApiError> | undefined => {
  return createSelector(selectSelf, (state) => {
    return state.buttons.fetchState.fetchStatus[remoteId]
  })
}

export const pushButtonStateSelector = (buttonId: ButtonId): (state: RootStore) => RequestStatus<ApiError> | undefined => {
  return createSelector(selectSelf, (state) => {
    return state.buttons.requestState.pushButtonStatus[buttonId]
  })
}
