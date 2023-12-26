import { type PayloadAction, createSlice } from '@reduxjs/toolkit'
import { type ApiError } from '../../interfaces/api'
import { type RequestStatus } from '../../utils/reqStatus'
import { type IrData } from '../../type/irdata.type'
import { type ButtonId } from '../../type/button'
import { type RemoteId } from '../../type/remote'

interface RequestState {
  pushButtonStatus: Record<ButtonId, RequestStatus<ApiError> | undefined>
  learnIrDataStatus: RequestStatus<ApiError>
}

const initialState: RequestState = {
  pushButtonStatus: {},
  learnIrDataStatus: {
    status: 'idle',
    error: undefined
  }
}

const requestStateSlice = createSlice({
  name: 'requestState.buttons',
  initialState,
  reducers: {
    pushButtonRequested: (state, action: PayloadAction<{ buttonId: ButtonId }>) => {
      const { buttonId } = action.payload
      state.pushButtonStatus[buttonId] = {
        status: 'pending',
        error: undefined
      }
    },
    pushButtonFailure: (state, action: PayloadAction<{ buttonId: ButtonId, error: ApiError }>) => {
      const { buttonId, error } = action.payload
      state.pushButtonStatus[buttonId] = {
        status: 'failed',
        error
      }
    },
    pushButtonSuccess: (state, action: PayloadAction<{ buttonId: ButtonId }>) => {
      const { buttonId } = action.payload
      state.pushButtonStatus[buttonId] = {
        status: 'success',
        error: undefined
      }
    },
    clearPushButtonStatus: (state, action: PayloadAction<{ buttonId: ButtonId }>) => {
      const { buttonId } = action.payload
      state.pushButtonStatus[buttonId] = {
        status: 'idle',
        error: undefined
      }
    },

    learnIrDataRequested: (state, _: PayloadAction<{ remoteId: RemoteId, buttonId: ButtonId, irData: IrData }>) => {
      state.learnIrDataStatus = {
        status: 'pending',
        error: undefined
      }
    },
    learnIrDataFailure: (state, action: PayloadAction<{ error: ApiError }>) => {
      state.learnIrDataStatus = {
        status: 'failed',
        error: action.payload.error
      }
    },
    learnIrDataSuccess: (state) => {
      state.learnIrDataStatus = {
        status: 'success',
        error: undefined
      }
    },
    clearLearnIrDataStatus: (state) => {
      state.learnIrDataStatus = {
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
