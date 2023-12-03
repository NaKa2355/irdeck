import { type PayloadAction, createSlice } from '@reduxjs/toolkit'
import { type RequestStatus } from '../../utils/reqStatus'
import { type EditRemoteReq, type AddRemoteReq, type ApiError, type DeleteRemoteReq } from '../../interfaces/api'

interface RequestState {
  postRemoteStatus: RequestStatus<ApiError>
  patchRemoteStatus: RequestStatus<ApiError>
  deleteRemoteStatus: RequestStatus<ApiError>
}

const initialState: RequestState = {
  postRemoteStatus: {
    isPending: false,
    isFailed: false,
    error: undefined
  },
  patchRemoteStatus: {
    isPending: false,
    isFailed: false,
    error: undefined
  },
  deleteRemoteStatus: {
    isPending: false,
    isFailed: false,
    error: undefined
  }
}

const requestStateSlice = createSlice({
  name: 'requestState.remotes',
  initialState,
  reducers: {
    postRemote: (state, _: PayloadAction<AddRemoteReq>) => {
      state.postRemoteStatus.isPending = true
    },
    postRemoteFailure: (state, action: PayloadAction<{ error: ApiError }>) => {
      const { error } = action.payload
      state.postRemoteStatus.error = error
      state.postRemoteStatus.isFailed = true
      state.postRemoteStatus.isPending = false
    },
    postRemoteSuccess: (state) => {
      state.postRemoteStatus.isFailed = false
      state.postRemoteStatus.isPending = false
    },

    patchRemote: (state, _: PayloadAction<EditRemoteReq>) => {
      state.patchRemoteStatus.isPending = true
    },
    patchRemoteFailure: (state, action: PayloadAction<{ error: ApiError }>) => {
      const { error } = action.payload
      state.patchRemoteStatus.error = error
      state.patchRemoteStatus.isFailed = true
      state.patchRemoteStatus.isPending = false
    },
    patchRemoteSuccess: (state) => {
      state.patchRemoteStatus.isFailed = false
      state.patchRemoteStatus.isPending = false
    },

    deleteRemote: (state, _: PayloadAction<DeleteRemoteReq>) => {
      state.deleteRemoteStatus.isPending = true
    },
    deleteRemoteFailure: (state, action: PayloadAction<{ error: ApiError }>) => {
      const { error } = action.payload
      state.deleteRemoteStatus.error = error
      state.deleteRemoteStatus.isFailed = true
      state.deleteRemoteStatus.isPending = false
    },
    deleteRemoteSuccess: (state) => {
      state.deleteRemoteStatus.isFailed = false
      state.deleteRemoteStatus.isPending = false
    }
  }
})

export const {
  postRemote,
  postRemoteFailure,
  postRemoteSuccess,
  patchRemote,
  patchRemoteFailure,
  patchRemoteSuccess,
  deleteRemote,
  deleteRemoteFailure,
  deleteRemoteSuccess
} = requestStateSlice.actions

export const requestStateReducer = requestStateSlice.reducer
