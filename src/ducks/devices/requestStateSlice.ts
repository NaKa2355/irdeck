import { type PayloadAction, createSlice } from '@reduxjs/toolkit'
import { type ApiError } from '../../interfaces/api'
import { type RequestStatus } from '../../utils/reqStatus'
import { type IrData } from '../../type/irdata.type'

interface RequestState {
  sendIrStatus: RequestStatus<ApiError>
  receiveIrStatus: RequestStatus<ApiError>
}

const initialState: RequestState = {
  sendIrStatus: {
    isFailed: false,
    isPending: false,
    error: undefined
  },
  receiveIrStatus: {
    isFailed: false,
    isPending: false,
    error: undefined
  }
}

const requestStateSlice = createSlice({
  name: 'resuestState.devices',
  initialState,
  reducers: {
    sendIr: (state, _: PayloadAction<{ deviceId: string, irData: IrData }>) => {
      state.sendIrStatus.isPending = true
    },
    sendIrFailure: (state, action: PayloadAction<{ error: ApiError }>) => {
      const { error } = action.payload
      state.sendIrStatus.error = error
      state.sendIrStatus.isFailed = true
      state.sendIrStatus.isPending = false
    },
    sendIrSuccess: (state) => {
      state.sendIrStatus.isPending = false
      state.sendIrStatus.isFailed = false
    },
    receiveIr: (state, _: PayloadAction<{ deviceId: string }>) => {
      state.receiveIrStatus.isPending = true
    },
    receiveIrFailure: (state, action: PayloadAction<{ error: ApiError }>) => {
      const { error } = action.payload
      state.receiveIrStatus.isPending = false
      state.receiveIrStatus.isFailed = true
      state.receiveIrStatus.error = error
    },
    receiveIrSuccess: (state) => {
      state.receiveIrStatus.isFailed = false
      state.receiveIrStatus.isPending = false
    }
  }
})

export const requestStateReducer = requestStateSlice.reducer

export const {
  sendIr,
  sendIrFailure,
  sendIrSuccess,
  receiveIr,
  receiveIrFailure,
  receiveIrSuccess
} = requestStateSlice.actions
