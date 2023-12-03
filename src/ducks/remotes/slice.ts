import { type PayloadAction, createSlice } from '@reduxjs/toolkit'
import { type Remote } from '../../type/remote'
import { success, type ApiError } from '../../interfaces/api'
import { type FetchStatus, type RequestStatus } from '../../utils/reqStatus'

interface RemotesState {
  domainData: {
    ids: string[]
    byId: Record<string, Remote>
  }
  appData: {
    selectedRemoteId: string | undefined
    fetchStatus: FetchStatus<ApiError>
    postRemoteStatus: RequestStatus<ApiError>
    patchRemoteStatus: RequestStatus<ApiError>
    deleteRemoteStatus: RequestStatus<ApiError>
  }
}

interface PostNewRemotePayload {
  remoteName: string
  deviceId: string
  tag: string
  buttons: Array<{
    buttonName: string
    tag: string
  }>
}

interface PostEditedRemotePayload {
  remoteId: string
  remoteName: string
  deviceId: string
}

const initialState: RemotesState = {
  domainData: {
    ids: [],
    byId: {}
  },
  appData: {
    selectedRemoteId: undefined,
    fetchStatus: {
      isFetching: false,
      isCached: false,
      isFetchFailed: false,
      fetchError: undefined
    },
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
}

interface RemoteAddedActionPayload {
  remoteId: string
  remoteName: string
  deviceId: string
  tag: string
}

interface RemoteEditedActionPayload {
  remoteId: string
  remoteName: string
  deviceId: string
}

const remotesSlice = createSlice({
  name: 'domainData.remotes',
  initialState,
  reducers: {
    selectRemote: (state, action: PayloadAction<{ remoteId: string | undefined }>) => {
      state.appData.selectedRemoteId = action.payload.remoteId
    },

    fetchRemotes: (state) => {
      state.appData.fetchStatus.isFetching = true
      state.appData.fetchStatus.isFetchFailed = false
    },

    fetchRemotesFailure: (state, action: PayloadAction<{ error: ApiError }>) => {
      state.appData.fetchStatus.isFetching = false
      state.appData.fetchStatus.isFetchFailed = true
      state.appData.fetchStatus.fetchError = action.payload.error
    },

    fetchRemotesSuccess: (state, action: PayloadAction<{ remotes: Remote[] }>) => {
      state.appData.fetchStatus.isFetching = false
      state.appData.fetchStatus.isCached = true
      state.appData.fetchStatus.isFetchFailed = false

      state.domainData.ids = action.payload.remotes.map((remote) => remote.id)
      action.payload.remotes.forEach((remote) => {
        state.domainData.byId[remote.id] = remote
      })
    },

    postRemote: (state, _: PayloadAction<PostNewRemotePayload>) => {
      state.appData.postRemoteStatus.isPending = true
      state.appData.postRemoteStatus.isFailed = false
    },

    postRemoteFailure: (state, action: PayloadAction<{ error: ApiError }>) => {
      state.appData.postRemoteStatus.isPending = false
      state.appData.postRemoteStatus.isFailed = true
      state.appData.postRemoteStatus.error = action.payload.error
    },

    postRemoteSuccess: (state, action: PayloadAction<RemoteAddedActionPayload>) => {
      const payload = action.payload

      state.appData.postRemoteStatus.isPending = false
      state.appData.postRemoteStatus.isFailed = false

      state.domainData.ids.push(payload.remoteId)
      state.domainData.byId[payload.remoteId] = {
        id: payload.remoteId,
        name: payload.remoteName,
        deviceId: payload.deviceId,
        tag: payload.tag
      }
    },

    patchRemote: (state, _: PayloadAction<PostEditedRemotePayload>) => {
      state.appData.patchRemoteStatus.isPending = true
      state.appData.patchRemoteStatus.isFailed = false
    },

    patchRemoteFailure: (state, action: PayloadAction<{ error: ApiError }>) => {
      state.appData.patchRemoteStatus.isPending = false
      state.appData.patchRemoteStatus.isFailed = true
      state.appData.patchRemoteStatus.error = action.payload.error
    },

    patchRemoteSuccess: (state, action: PayloadAction<RemoteEditedActionPayload>) => {
      state.appData.patchRemoteStatus.isPending = false
      state.appData.patchRemoteStatus.isFailed = false

      if (state.domainData.byId[action.payload.remoteId] === undefined) {
        return
      }
      state.domainData.byId[action.payload.remoteId].deviceId = action.payload.deviceId
      state.domainData.byId[action.payload.deviceId].name = action.payload.remoteName
    },

    deleteRemote: (state, _: PayloadAction<{ remoteId: string }>) => {
      state.appData.patchRemoteStatus.isPending = true
      state.appData.patchRemoteStatus.isFailed = false
    },

    deleteRemoteFailure: (state, action: PayloadAction<{ error: ApiError }>) => {
      state.appData.patchRemoteStatus.isFailed = true
      state.appData.patchRemoteStatus.isPending = false
      state.appData.patchRemoteStatus.error = action.payload.error
    },

    deleteRemoteSuccess: (state, action: PayloadAction<{ deletedRemoteId: string }>) => {
      state.appData.patchRemoteStatus.isFailed = false
      state.appData.patchRemoteStatus.isPending = false
      state.appData.patchRemoteStatus.error = success
      state.domainData.ids.filter((id) => id !== action.payload.deletedRemoteId)
    }
  }
})

export const remoteReducer = remotesSlice.reducer

export const {
  selectRemote,
  fetchRemotes,
  fetchRemotesFailure,
  fetchRemotesSuccess,
  postRemote,
  postRemoteFailure,
  postRemoteSuccess,
  patchRemote,
  patchRemoteFailure,
  patchRemoteSuccess,
  deleteRemote,
  deleteRemoteFailure,
  deleteRemoteSuccess
} = remotesSlice.actions
