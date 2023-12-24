import { type PayloadAction, createSlice } from '@reduxjs/toolkit'
import { type ApiError } from '../../interfaces/api'
import { type RequestStatus } from '../../utils/reqStatus'

interface RequestState {
  receiveIrStatus: Record<string, RequestStatus<ApiError>>
  sendIrStatus: Record<string, RequestStatus<ApiError>>
}

const initialState: RequestState = {
  receiveIrStatus: {},
  sendIrStatus: {}
}

const requestStateSlice = createSlice({
  name: 'resuestState.devices',
  initialState,
  reducers: {
    sendIrDataRequested: (state, action: PayloadAction<{ deviceId: string }>) => {
      const { deviceId } = action.payload
      state.sendIrStatus[deviceId] = {
        status: 'pending',
        error: undefined
      }
    },
    sendIrDataFailure: (state, action: PayloadAction<{ deviceId: string, error: ApiError }>) => {
      const { deviceId, error } = action.payload
      state.sendIrStatus[deviceId] = {
        status: 'failed',
        error
      }
    },
    sendIrDataSuccess: (state, action: PayloadAction<{ deviceId: string }>) => {
      const { deviceId } = action.payload
      state.sendIrStatus[deviceId] = {
        status: 'success',
        error: undefined
      }
    },
    clearSendIrDataStatus: (state, action: PayloadAction<{ deviceId: string }>) => {
      const { deviceId } = action.payload
      state.sendIrStatus[deviceId] = {
        status: 'idle',
        error: undefined
      }
    },

    receiveIrRequested: (state, action: PayloadAction<{ deviceId: string }>) => {
      const { deviceId } = action.payload
      state.receiveIrStatus[deviceId] = {
        status: 'pending',
        error: undefined
      }
    },
    receiveIrFailure: (state, action: PayloadAction<{ deviceId: string, error: ApiError }>) => {
      const { deviceId, error } = action.payload
      state.receiveIrStatus[deviceId] = {
        status: 'failed',
        error
      }
    },
    receiveIrSuccess: (state, action: PayloadAction<{ deviceId: string }>) => {
      const { deviceId } = action.payload
      state.receiveIrStatus[deviceId] = {
        status: 'success',
        error: undefined
      }
    },
    clearReceiveIrStatus: (state, action: PayloadAction<{ deviceId: string }>) => {
      const { deviceId } = action.payload
      state.receiveIrStatus[deviceId] = {
        status: 'idle',
        error: undefined
      }
    }
  }
})

export const requestStateReducer = requestStateSlice.reducer

export const {
  sendIrDataRequested,
  sendIrDataFailure,
  sendIrDataSuccess,
  clearSendIrDataStatus,
  receiveIrRequested,
  receiveIrFailure,
  receiveIrSuccess,
  clearReceiveIrStatus
} = requestStateSlice.actions
