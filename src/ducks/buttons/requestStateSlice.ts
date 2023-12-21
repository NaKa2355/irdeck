import { type PayloadAction, createSlice } from '@reduxjs/toolkit'
import { type ApiError } from '../../interfaces/api'
import { type RequestStatus } from '../../utils/reqStatus'

interface RequestState {
  pushButtonStatus: Record<string, RequestStatus<ApiError> | undefined>
  learnIrDataStatus: Record<string, RequestStatus<ApiError> | undefined>
}

const initialState: RequestState = {
  pushButtonStatus: {},
  learnIrDataStatus: {}
}

const requestStateSlice = createSlice({
  name: 'requestState.buttons',
  initialState,
  reducers: {
    pushButtonRequested: (state, action: PayloadAction<{ buttonId: string }>) => {
      const { buttonId } = action.payload
      state.pushButtonStatus[buttonId] = {
        status: 'pending',
        error: undefined
      }
    },
    pushButtonFailure: (state, action: PayloadAction<{ buttonId: string, error: ApiError }>) => {
      const { buttonId, error } = action.payload
      state.pushButtonStatus[buttonId] = {
        status: 'failed',
        error
      }
    },
    pushButtonSuccess: (state, action: PayloadAction<{ buttonId: string }>) => {
      const { buttonId } = action.payload
      state.pushButtonStatus[buttonId] = {
        status: 'success',
        error: undefined
      }
    },
    clearPushButtonStatus: (state, action: PayloadAction<{ buttonId: string }>) => {
      const { buttonId } = action.payload
      state.pushButtonStatus[buttonId] = {
        status: 'idle',
        error: undefined
      }
    },
    learnIrDataRequested: (state, action: PayloadAction<{ buttonId: string }>) => {
      const { buttonId } = action.payload
      state.learnIrDataStatus[buttonId] = {
        status: 'pending',
        error: undefined
      }
    },
    learnIrDataFailure: (state, action: PayloadAction<{ buttonId: string, error: ApiError }>) => {
      const { buttonId, error } = action.payload
      state.learnIrDataStatus[buttonId] = {
        status: 'failed',
        error
      }
    },
    learnIrDataSuccess: (state, action: PayloadAction<{ buttonId: string }>) => {
      const { buttonId } = action.payload
      state.learnIrDataStatus[buttonId] = {
        status: 'success',
        error: undefined
      }
    },
    clearLearnIrDataStatus: (state, action: PayloadAction<{ buttonId: string }>) => {
      const { buttonId } = action.payload
      state.learnIrDataStatus[buttonId] = {
        status: 'idle',
        error: undefined
      }
    }
  }
})

export const requestStateReducer = requestStateSlice.reducer
export const {
  pushButtonRequested,
  pushButtonFailure,
  pushButtonSuccess,
  clearPushButtonStatus,
  learnIrDataRequested,
  learnIrDataFailure,
  learnIrDataSuccess,
  clearLearnIrDataStatus
} = requestStateSlice.actions
