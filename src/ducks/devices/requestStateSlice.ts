import { type PayloadAction, createSlice } from '@reduxjs/toolkit'
import { type ApiError } from '../../interfaces/api'
import { type RequestStatus } from '../../utils/reqStatus'

interface RequestState {
  sendIrStatus: RequestStatus<ApiError>
  receiveIrStatus: RequestStatus<ApiError>
}

const initialState: RequestState = {
  sendIrStatus: {
    status: 'idle',
    error: undefined
  },
  receiveIrStatus: {
    status: 'idle',
    error: undefined
  }
}

const requestStateSlice = createSlice({
  name: 'resuestState.devices',
  initialState,
  reducers: {
    tryIrDataRequested: (state) => {
      state.sendIrStatus.status = 'pending'
    },
    tryIrDataFailure: (state, action: PayloadAction<{ error: ApiError }>) => {
      const { error } = action.payload
      state.sendIrStatus.error = error
      state.sendIrStatus.status = 'failed'
    },
    tryIrDataSuccess: (state) => {
      state.sendIrStatus.status = 'success'
    },
    clearTryIrDataStatus: (state) => {
      state.sendIrStatus.status = 'idle'
    },
    receiveIrRequested: (state) => {
      state.receiveIrStatus.status = 'pending'
    },
    receiveIrFailure: (state, action: PayloadAction<{ error: ApiError }>) => {
      const { error } = action.payload
      state.receiveIrStatus.status = 'failed'
      state.receiveIrStatus.error = error
    },
    receiveIrSuccess: (state) => {
      state.receiveIrStatus.status = 'success'
    },
    clearReceiveIrStatus: (state) => {
      state.receiveIrStatus.status = 'idle'
    }
  }
})

export const requestStateReducer = requestStateSlice.reducer

export const {
  tryIrDataRequested,
  tryIrDataFailure,
  tryIrDataSuccess,
  clearTryIrDataStatus,
  receiveIrRequested,
  receiveIrFailure,
  receiveIrSuccess,
  clearReceiveIrStatus
} = requestStateSlice.actions
