import { type PayloadAction, createSlice } from '@reduxjs/toolkit'
import { type Button } from '../../type/button'
import { type IrData } from '../../type/irdata.type'
import { type ApiError } from '../../interfaces/api'
import { type FetchStatus, type RequestStatus } from '../../utils/reqStatus'

interface ButtonsState {
  domianData: {
    ids: Record<string, string[]>
    byIds: Record<string, Button>
  }
  appData: {
    requestStatus: Record<
    string,
    {
      pushButton: RequestStatus<ApiError>
      patchIrData: RequestStatus<ApiError>
    } | undefined
    >

    fetchStatus: Record<
    string,
    FetchStatus<ApiError> | undefined
    >
  }
}

const initialRequestStatus = {
  pushButton: {
    isPending: false,
    isFailed: false,
    error: undefined
  },
  patchIrData: {
    isPending: false,
    isFailed: false,
    error: undefined
  }
}

const initialState: ButtonsState = {
  domianData: {
    ids: {},
    byIds: {}
  },
  appData: {
    requestStatus: {},
    fetchStatus: {}
  }
}

const buttonsSlice = createSlice({
  name: 'buttons',
  initialState,
  reducers: {

    pushButton: (state, action: PayloadAction<{ remoteId: string, buttonId: string, deviceId: string }>) => {
      const status = state.appData.requestStatus[action.payload.buttonId]
      if (status === undefined) {
        return
      }
      status.pushButton = {
        isPending: true,
        isFailed: false,
        error: undefined
      }
    },

    pushButtonFailure: (state, action: PayloadAction<{ buttonId: string, error: ApiError }>) => {
      const status = state.appData.requestStatus[action.payload.buttonId]
      if (status === undefined) {
        return
      }
      status.pushButton = {
        isPending: false,
        isFailed: true,
        error: action.payload.error
      }
    },

    pushButtonSuccess: (state, action: PayloadAction<{ buttonId: string }>) => {
      const status = state.appData.requestStatus[action.payload.buttonId]
      if (status === undefined) {
        return
      }
      status.pushButton = {
        isPending: false,
        isFailed: false,
        error: undefined
      }
    },

    patchIrData: (state, action: PayloadAction<{ remoteId: string, buttonId: string, irData: IrData }>) => {
      const status = state.appData.requestStatus[action.payload.buttonId]
      if (status === undefined) {
        return
      }
      status.patchIrData = {
        isPending: true,
        isFailed: false,
        error: undefined
      }
    },

    patchIrDataFailure: (state, action: PayloadAction<{ buttonId: string, error: ApiError }>) => {
      const status = state.appData.requestStatus[action.payload.buttonId]
      if (status === undefined) {
        return
      }

      status.patchIrData = {
        isPending: false,
        isFailed: true,
        error: action.payload.error
      }
    },

    patchIrDataSuccess: (state, action: PayloadAction<{ buttonId: string }>) => {
      const status = state.appData.requestStatus[action.payload.buttonId]
      if (status === undefined) {
        return
      }
      status.patchIrData = {
        isPending: false,
        isFailed: false,
        error: undefined
      }
    },

    fetchButtons: (state, action: PayloadAction<{ remoteId: string }>) => {
      const remoteId = action.payload.remoteId
      const status = state.appData.fetchStatus[remoteId]
      if (status !== undefined) {
        status.isFetching = true
        status.isFetchFailed = false
        return
      }

      state.appData.fetchStatus[remoteId] = {
        isFetching: true,
        isCached: false,
        isFetchFailed: false,
        fetchError: undefined
      }
    },

    fetchButtonsFailure: (state, action: PayloadAction<{ remoteId: string, error: ApiError }>) => {
      const status = state.appData.fetchStatus[action.payload.remoteId]
      if (status === undefined) {
        return
      }
      status.isFetching = false
      status.isFetchFailed = true
      status.fetchError = action.payload.error
    },

    fetchButtonsSuccess: (state, action: PayloadAction<{ remoteId: string, buttons: Button[] }>) => {
      state.domianData.ids[action.payload.remoteId] = action.payload.buttons.map((button) => button.id)

      action.payload.buttons.forEach((button) => {
        state.domianData.byIds[button.id] = button
        state.appData.requestStatus[button.id] = initialRequestStatus
      })

      const status = state.appData.fetchStatus[action.payload.remoteId]
      if (status === undefined) {
        return
      }

      status.isCached = true
      status.isFetching = false
      status.isFetchFailed = false
    }
  }
})

export const buttonsReducer = buttonsSlice.reducer

export const {
  fetchButtons,
  fetchButtonsFailure,
  fetchButtonsSuccess,
  pushButton,
  pushButtonFailure,
  pushButtonSuccess,
  patchIrData,
  patchIrDataFailure,
  patchIrDataSuccess
} = buttonsSlice.actions
