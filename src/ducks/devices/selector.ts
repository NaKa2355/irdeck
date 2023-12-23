import { createSelector } from '@reduxjs/toolkit'
import { type RootStore } from '../../app'
import { type IrData } from '../../type/irdata.type'
import { type RequestStatus } from '../../utils/reqStatus'
import { type ApiError } from '../../interfaces/api'

const selectSelf = (state: RootStore): RootStore => state

export const devicesCanSendSelector = createSelector(selectSelf, (state) => {
  const domain = state.devices.domain
  const devicesIdCanSend = domain.ids.filter(id => domain.byId[id].canSend)
  return devicesIdCanSend.map(id => domain.byId[id])
})

export const devicesCanReceiveSelector = createSelector(selectSelf, (state) => {
  const domain = state.devices.domain
  const devicesIdCanSend = domain.ids.filter(id => domain.byId[id].canReceive)
  return devicesIdCanSend.map(id => domain.byId[id])
})

export const receivedIrDataSelector = (deviceId: string): (state: RootStore) => IrData => {
  return createSelector(selectSelf, (state) => {
    return state.devices.receivedIrData.irData[deviceId] ?? new Uint8Array()
  })
}

export const receiveIrDataStatusSelector = (deviceId: string): (state: RootStore) => RequestStatus<ApiError> | undefined => {
  return createSelector(selectSelf, (state) => {
    return state.devices.requestState[deviceId]?.receiveIrStatus
  })
}
