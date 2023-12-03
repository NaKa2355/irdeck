import { type PayloadAction, createSlice } from '@reduxjs/toolkit'
import { type ApiError } from '../../interfaces/api'
import { type RequestStatus } from '../../utils/reqStatus'
import { type IrData } from '../../type/irdata.type'

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
    pushButton: (state, action: PayloadAction<{ buttonId: string }>) => {
      const { buttonId } = action.payload
      state.pushButtonStatus[buttonId] = {
        isFailed: false,
        isPending: true,
        error: undefined
      }
    },
    pushButtonFailure: (state, action: PayloadAction<{ buttonId: string, error: ApiError }>) => {
      const { buttonId, error } = action.payload
      state.pushButtonStatus[buttonId] = {
        isFailed: true,
        isPending: false,
        error
      }
    },
    pushButtonSuccess: (state, action: PayloadAction<{ buttonId: string }>) => {
      const { buttonId } = action.payload
      state.pushButtonStatus[buttonId] = {
        isFailed: false,
        isPending: false,
        error: undefined
      }
    },
    leanIrData: (state, action: PayloadAction<{ buttonId: string, irData: IrData }>) => {
      const { buttonId } = action.payload
      state.learnIrDataStatus[buttonId] = {
        isFailed: false,
        isPending: true,
        error: undefined
      }
    },
    learnIrDataFailure: (state, action: PayloadAction<{ buttonId: string, error: ApiError }>) => {
      const { buttonId, error } = action.payload
      state.learnIrDataStatus[buttonId] = {
        isFailed: true,
        isPending: false,
        error
      }
    },
    learnIrDataSuccess: (state, action: PayloadAction<{ buttonId: string }>) => {
      const { buttonId } = action.payload
      state.learnIrDataStatus[buttonId] = {
        isFailed: false,
        isPending: false,
        error: undefined
      }
    }
  }
})

export const requestStateReducer = requestStateSlice.reducer
export const {
  pushButton,
  pushButtonFailure,
  pushButtonSuccess,
  leanIrData,
  learnIrDataFailure,
  learnIrDataSuccess
} = requestStateSlice.actions
