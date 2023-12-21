import { createSelector } from '@reduxjs/toolkit'
import { type RootStore } from '../../app'

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

export const receivedIrDataSelector = createSelector(selectSelf, (state) => {
  return state.devices.receivedIrData.irData ?? new Uint8Array()
})
