import { type PayloadAction, createSlice } from '@reduxjs/toolkit'
import { type Device } from '../../type/device.type'
import { success, type ApiError } from '../../interfaces/api'
import { type RequestStatus, type FetchStatus } from '../../utils/reqStatus'
import { type IrData } from '../../type/irdata.type'

type DomainDevice = {
  receivedIrData: IrData
} & Device

interface DevicesState {
  domainData: {
    ids: string[]
    byId: Record<string, DomainDevice>
  }
  appData: {
    fetchStatus: FetchStatus<ApiError>
    postIrDataStatus: Record<string, RequestStatus<ApiError> | undefined>
    postReceiveIrStatus: Record<string, RequestStatus<ApiError> | undefined>
  }
}

const initialState: DevicesState = {
  domainData: {
    ids: [],
    byId: {}
  },
  appData: {
    fetchStatus: {
      isFetching: false,
      isCached: false,
      isFetchFailed: false,
      fetchError: success
    },
    postIrDataStatus: {},
    postReceiveIrStatus: {}
  }
}

const remotesSlice = createSlice({
  name: 'devices',
  initialState,
  reducers: {
    fetchDevices: (state) => {
      state.appData.fetchStatus.isFetching = true
      state.appData.fetchStatus.isFetchFailed = false
    },

    fetchDevicesFailure: (state, action: PayloadAction<{ error: ApiError }>) => {
      state.appData.fetchStatus.isFetching = false
      state.appData.fetchStatus.isFetchFailed = true
      state.appData.fetchStatus.fetchError = action.payload.error
    },

    fetchDevicesSuccess: (state, action: PayloadAction<{ devices: Device[] }>) => {
      state.appData.fetchStatus.isFetching = false
      state.appData.fetchStatus.isCached = true
      state.appData.fetchStatus.isFetchFailed = false
      state.domainData.ids = action.payload.devices.map((device) => device.id)
      action.payload.devices.forEach((device) => {
        state.domainData.byId[device.id] = {
          receivedIrData: new Uint8Array(),
          ...device
        }
      })
    },

    sendIr: (state, action: PayloadAction<{ deviceId: string, irData: IrData }>) => {
      state.appData.postIrDataStatus[action.payload.deviceId] = {
        isPending: true,
        isFailed: false,
        error: success
      }
    },

    sendIrFailure: (state, action: PayloadAction<{ deviceId: string, error: ApiError }>) => {
      state.appData.postIrDataStatus[action.payload.deviceId] = {
        isPending: false,
        isFailed: true,
        error: action.payload.error
      }
    },

    sendIrSuccess: (state, action: PayloadAction<{ deviceId: string }>) => {
      state.appData.postIrDataStatus[action.payload.deviceId] = {
        isPending: false,
        isFailed: true,
        error: success
      }
    },

    receiveIr: (state, action: PayloadAction<{ deviceId: string }>) => {
      state.appData.postReceiveIrStatus[action.payload.deviceId] = {
        isPending: true,
        isFailed: false,
        error: success
      }
    },

    receiveIrFailure: (state, action: PayloadAction<{ deviceId: string, error: ApiError }>) => {
      state.appData.postReceiveIrStatus[action.payload.deviceId] = {
        isPending: false,
        isFailed: true,
        error: action.payload.error
      }
    },

    receiveSuccess: (state, action: PayloadAction<{ deviceId: string, irData: IrData }>) => {
      state.appData.postReceiveIrStatus[action.payload.deviceId] = {
        isPending: false,
        isFailed: true,
        error: success
      }
      state.domainData.byId[action.payload.deviceId].receivedIrData = action.payload.irData
    }
  }
})

export const devicesReducer = remotesSlice.reducer

export const {
  fetchDevices,
  fetchDevicesFailure,
  fetchDevicesSuccess,
  sendIr,
  sendIrFailure,
  sendIrSuccess,
  receiveSuccess,
  receiveIr,
  receiveIrFailure
} = remotesSlice.actions
