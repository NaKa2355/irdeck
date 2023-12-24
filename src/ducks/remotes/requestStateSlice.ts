import { type PayloadAction, createSlice } from '@reduxjs/toolkit'
import { type RequestStatus } from '../../utils/reqStatus'
import { type CreateRemoteReq, type ApiError, type UpdateRemoteReq } from '../../interfaces/api'

interface RequestState {
  postRemoteStatus: RequestStatus<ApiError>
  patchRemoteStatus: RequestStatus<ApiError>
  deleteRemoteStatus: RequestStatus<ApiError>
}

const initialState: RequestState = {
  postRemoteStatus: {
    status: 'idle',
    error: undefined
  },
  patchRemoteStatus: {
    status: 'idle',
    error: undefined
  },
  deleteRemoteStatus: {
    status: 'idle',
    error: undefined
  }
}

const requestStateSlice = createSlice({
  name: 'requestState.remotes',
  initialState,
  reducers: {
    postRemoteRequested: (state, action: PayloadAction<CreateRemoteReq>) => {
      state.postRemoteStatus.status = 'pending'
    },
    postRemoteFailure: (state, action: PayloadAction<{ error: ApiError }>) => {
      const { error } = action.payload
      state.postRemoteStatus.error = error
      state.postRemoteStatus.status = 'failed'
    },
    postRemoteSuccess: (state) => {
      state.postRemoteStatus.status = 'success'
    },
    clearPostRemoteStatus: (state) => {
      state.postRemoteStatus.error = undefined
      state.postRemoteStatus.status = 'idle'
    },

    patchRemoteRequested: (state, action: PayloadAction<UpdateRemoteReq>) => {
      state.patchRemoteStatus.status = 'pending'
    },
    patchRemoteFailure: (state, action: PayloadAction<{ error: ApiError }>) => {
      const { error } = action.payload
      state.patchRemoteStatus.error = error
      state.patchRemoteStatus.status = 'failed'
    },
    patchRemoteSuccess: (state) => {
      state.patchRemoteStatus.status = 'success'
    },
    clearPatchRemoteStatus: (state) => {
      state.patchRemoteStatus.error = undefined
      state.patchRemoteStatus.status = 'idle'
    },

    deleteRemoteRequested: (state, action: PayloadAction<{ remoteId: string }>) => {
      state.deleteRemoteStatus.status = 'pending'
    },
    deleteRemoteFailure: (state, action: PayloadAction<{ error: ApiError }>) => {
      const { error } = action.payload
      state.deleteRemoteStatus.error = error
      state.deleteRemoteStatus.status = 'failed'
    },
    deleteRemoteSuccess: (state) => {
      state.deleteRemoteStatus.status = 'success'
    },
    clearDeleteRemoteStatus: (state) => {
      state.deleteRemoteStatus.error = undefined
      state.deleteRemoteStatus.status = 'idle'
    }
  }
})

export const {
  postRemoteRequested,
  postRemoteFailure,
  postRemoteSuccess,
  clearPostRemoteStatus,

  patchRemoteRequested,
  patchRemoteFailure,
  patchRemoteSuccess,
  clearPatchRemoteStatus,

  deleteRemoteRequested,
  deleteRemoteFailure,
  deleteRemoteSuccess,
  clearDeleteRemoteStatus
} = requestStateSlice.actions

export const requestStateReducer = requestStateSlice.reducer
