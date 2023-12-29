import { createSelector } from '@reduxjs/toolkit'
import { type RootStore } from '../../app/store'
import { type ApiError } from '../../interfaces/api'
import { type ButtonId } from '../../type/button'
import { type FetchStatus, type RequestStatus } from '../../utils/reqStatus'
import { type RemoteId } from '../../type/remote'
import memoize from 'lodash.memoize'

export const buttonsSelector = memoize((remoteId: string) => {
  return createSelector(
    (state: RootStore) => {
      return state.buttons.domain.ids[remoteId]
    },
    (state: RootStore) => state.buttons.domain.byId,
    (ids, byId) => {
      if (remoteId === null) {
        return undefined
      }
      if (ids === undefined) {
        return undefined
      }
      return ids.map(id => byId[id])
    }
  )
})

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
