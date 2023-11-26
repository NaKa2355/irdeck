import { type PayloadAction, createSlice } from '@reduxjs/toolkit'
import { type Button } from '../../type/button'
import { type IrData } from '../../type/irdata.type'
import { success, type ApiError } from '../../interfaces/api'
import { type FetchStatus, type PostStatus } from '../../utils/reqStatus'

interface ButtonsState {
  domianData: {
    ids: Record<string, string[]>
    byIds: Record<string, Button>
  }
  appData: {
    postingStatus: Record<string, {
      pushButton: PostStatus<ApiError> | undefined
      settingIrData: PostStatus<ApiError> | undefined
    }>
    fetchingStatus: Record<string, FetchStatus<ApiError> | undefined>
  }
}

const initialState: ButtonsState = {
  domianData: {
    ids: {},
    byIds: {}
  },
  appData: {
    postingStatus: {},
    fetchingStatus: {}
  }
}

const buttonsSlice = createSlice({
  name: 'buttons',
  initialState,
  reducers: {

    postPushButtonReq: (state, action: PayloadAction<{ remoteId: string, buttonId: string, deviceId: string }>) => {
      state.appData.postingStatus[action.payload.buttonId].pushButton = {
        isPosting: true,
        isPostFailed: false,
        postError: success
      }
    },

    postPushButtonFailure: (state, action: PayloadAction<{ buttonId: string, error: ApiError }>) => {
      state.appData.postingStatus[action.payload.buttonId].pushButton = {
        isPosting: false,
        isPostFailed: true,
        postError: action.payload.error
      }
    },

    postPushButtonSuccess: (state, action: PayloadAction<{ buttonId: string }>) => {
      state.appData.postingStatus[action.payload.buttonId].pushButton = {
        isPosting: false,
        isPostFailed: false,
        postError: success
      }
    },

    postSettingIrData: (state, action: PayloadAction<{ remoteId: string, buttonId: string, irData: IrData }>) => {
      state.appData.postingStatus[action.payload.buttonId].settingIrData = {
        isPosting: true,
        isPostFailed: false,
        postError: success
      }
    },

    postSettingIrDataFailure: (state, action: PayloadAction<{ buttonId: string, error: ApiError }>) => {
      state.appData.postingStatus[action.payload.buttonId].settingIrData = {
        isPosting: false,
        isPostFailed: true,
        postError: action.payload.error
      }
    },

    postSettingIrDataSuccess: (state, action: PayloadAction<{ buttonId: string }>) => {
      state.appData.postingStatus[action.payload.buttonId].settingIrData = {
        isPosting: false,
        isPostFailed: false,
        postError: success
      }
    },

    fetchButtons: (state, action: PayloadAction<{ remoteId: string }>) => {
      const remoteId = action.payload.remoteId
      const fetchButtonsStatus = state.appData.fetchingStatus[remoteId]
      if (fetchButtonsStatus !== undefined) {
        fetchButtonsStatus.isFetching = true
        fetchButtonsStatus.isFetchFailed = false
        return
      }
      state.appData.fetchingStatus[remoteId] = {
        isFetching: true,
        isCached: false,
        isFetchFailed: false,
        fetchError: success
      }
    },

    fetchButtonsFailure: (state, action: PayloadAction<{ remoteId: string, error: ApiError }>) => {
      const fetchButtonStatus = state.appData.fetchingStatus[action.payload.remoteId]
      if (fetchButtonStatus === undefined) {
        return
      }
      fetchButtonStatus.isFetching = false
      fetchButtonStatus.isFetchFailed = true
      fetchButtonStatus.fetchError = action.payload.error
    },

    fetchButtonsSuccess: (state, action: PayloadAction<{ remoteId: string, buttons: Button[] }>) => {
      state.domianData.ids[action.payload.remoteId] = action.payload.buttons.map((button) => button.id)
      action.payload.buttons.forEach((button) => {
        state.domianData.byIds[button.id] = button
      })
      const fetchButtonStatus = state.appData.fetchingStatus[action.payload.remoteId]
      if (fetchButtonStatus === undefined) {
        return
      }
      fetchButtonStatus.isFetching = false
      fetchButtonStatus.isFetchFailed = false
    }
  }
})

export const buttonsReducer = buttonsSlice.reducer

export const {
  fetchButtons,
  fetchButtonsFailure,
  fetchButtonsSuccess,
  postPushButtonReq,
  postPushButtonFailure,
  postPushButtonSuccess,
  postSettingIrData,
  postSettingIrDataFailure,
  postSettingIrDataSuccess
} = buttonsSlice.actions
