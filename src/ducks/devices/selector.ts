import { type ApiError } from '../../interfaces/api'
import { type RootStore } from '../../store/store'
import { type Device } from '../../type/device.type'
import { type FetchStatus, type PostStatus } from '../../utils/reqStatus'

interface DevicesState {
  fetchStatus: FetchStatus<ApiError>
  postIrDataStatus: Record<string, PostStatus<ApiError> | undefined>
  postReceiveIrStatus: Record<string, PostStatus<ApiError> | undefined>
}

export const selectDevicesCanSend = (state: RootStore): Device[] => {
  return state.devices.domainData.ids.filter((id) => {
    return state.devices.domainData.byId[id].canSend
  }).map((id) => {
    return state.devices.domainData.byId[id]
  })
}

export const selectDevicesCanReceive = (state: RootStore): Device[] => {
  return state.devices.domainData.ids.filter((id) => {
    return state.devices.domainData.byId[id].canReceive
  }).map((id) => {
    return state.devices.domainData.byId[id]
  })
}

export const selectDevicesState = (state: RootStore): DevicesState => {
  return state.devices.appData
}
