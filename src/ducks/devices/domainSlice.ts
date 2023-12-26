import { type PayloadAction, createSlice } from '@reduxjs/toolkit'
import { type DeviceId, type Device } from '../../type/device.type'

interface DevicesState {
  ids: DeviceId[]
  byId: Record<DeviceId, Device>
}

const initialState: DevicesState = {
  ids: [],
  byId: {}
}

const devicesSlice = createSlice({
  name: 'domain.devices',
  initialState,
  reducers: {
    devicesFetched: (state, action: PayloadAction<{ devices: Device[] }>) => {
      const { devices } = action.payload
      state.ids = devices.map(device => device.id)
      devices.forEach((device) => {
        state.byId[device.id] = device
      })
    }
  }
})

export const {
  devicesFetched
} = devicesSlice.actions
export const domainDeviceReducer = devicesSlice.reducer
