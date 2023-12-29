import { createSelector } from '@reduxjs/toolkit'
import { type RootStore } from '../../app/store'
import { type ApiError } from '../../interfaces/api'
import { type ButtonId, type Button } from '../../type/button'
import { type FetchStatus, type RequestStatus } from '../../utils/reqStatus'
import { type RemoteId } from '../../type/remote'

export const buttonsSelector = (remoteId: RemoteId | null): (state: RootStore) => Button[] | undefined => {
  return createSelector(
    (state: RootStore) => state.buttons.domain,
    (buttons) => {
      if (remoteId === null) {
        return undefined
      }
      const buttonIds = buttons.ids[remoteId]
      if (buttonIds === undefined) {
        return undefined
      }
      const buttonsArray = new Array<Button>(buttonIds.length)
      for (let i = 0; i < buttonIds.length; i++) {
        buttonsArray[i] = buttons.byId[buttonIds[i]]
      }
      return buttonsArray
    })
}

export const fetchButtonsStatusSelector = (remoteId: RemoteId): (state: RootStore) => FetchStatus<ApiError> | undefined => {
  return createSelector(
    (state: RootStore) => state.buttons.fetchState.fetchStatus[remoteId],
    (status) => status
  )
}

export const pushButtonStateSelector = (buttonId: ButtonId): (state: RootStore) => RequestStatus<ApiError> | undefined => {
  return createSelector(
    (state: RootStore) => state.buttons.requestState.pushButtonStatus[buttonId],
    (status) => status
  )
}
