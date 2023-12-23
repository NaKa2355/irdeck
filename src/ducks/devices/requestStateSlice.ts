import { type PayloadAction, createSlice } from '@reduxjs/toolkit'
import { type ApiError } from '../../interfaces/api'
import { type RequestStatus } from '../../utils/reqStatus'

type RequestState = Record<string, {
  receiveIrStatus: RequestStatus<ApiError>
} | undefined>

const initialState: RequestState = {}

const requestStateSlice = createSlice({
  name: 'resuestState.devices',
  initialState,
  reducers: {
    receiveIrRequested: (state, action: PayloadAction<{ deviceId: string }>) => {
      const { deviceId } = action.payload
      state[deviceId] = {
        receiveIrStatus: {
          status: 'pending',
          error: undefined
        }
      }
    },
    receiveIrFailure: (state, action: PayloadAction<{ deviceId: string, error: ApiError }>) => {
      const { deviceId, error } = action.payload
      state[deviceId] = {
        receiveIrStatus: {
          status: 'failed',
          error
        }
      }
    },
    receiveIrSuccess: (state, action: PayloadAction<{ deviceId: string }>) => {
      const { deviceId } = action.payload
      state[deviceId] = {
        receiveIrStatus: {
          status: 'success',
          error: undefined
        }
      }
    },
    clearReceiveIrStatus: (state, action: PayloadAction<{ deviceId: string }>) => {
      const { deviceId } = action.payload
      state[deviceId] = {
        receiveIrStatus: {
          status: 'pending',
          error: undefined
        }
      }
    }
  }
})

export const requestStateReducer = requestStateSlice.reducer

export const {
  receiveIrRequested,
  receiveIrFailure,
  receiveIrSuccess,
  clearReceiveIrStatus
} = requestStateSlice.actions
