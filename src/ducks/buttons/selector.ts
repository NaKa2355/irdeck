import { createSelector } from '@reduxjs/toolkit'
import { type RootStore } from '../../app/store'
import { type ApiError } from '../../interfaces/api'
import { type ButtonId } from '../../type/button'
import { type RequestStatus } from '../../utils/reqStatus'
import memoize from 'lodash.memoize'

export const buttonsSelector = memoize((remoteId: string | undefined) => {
  return createSelector(
    (state: RootStore) => {
      if (remoteId === undefined) {
        return undefined
      }
      return state.remotes.domain.byId[remoteId]?.buttonIds
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

export const pushButtonStateSelector = (buttonId: ButtonId): (state: RootStore) => RequestStatus<ApiError> | undefined => {
  return createSelector(
    (state: RootStore) => state.buttons.requestState.pushButtonStatus[buttonId],
    (status) => status
  )
}
