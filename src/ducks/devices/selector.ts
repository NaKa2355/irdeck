import { type RootStore } from '../../app'
import { type Device } from '../../type/device.type'
import { type IrData } from '../../type/irdata.type'

export const devicesCanSendSelector = (state: RootStore): Device[] => {
  const domain = state.devices.domain
  const devicesIdCanSend = domain.ids.filter(id => domain.byId[id].canSend)
  return devicesIdCanSend.map(id => domain.byId[id])
}

export const devicesCanReceiveSelector = (state: RootStore): Device[] => {
  const domain = state.devices.domain
  const devicesIdCanSend = domain.ids.filter(id => domain.byId[id].canReceive)
  return devicesIdCanSend.map(id => domain.byId[id])
}

export const receivedIrDataSelector = (state: RootStore): IrData => {
  return state.devices.receivedIrData.irData ?? new Uint8Array()
}
