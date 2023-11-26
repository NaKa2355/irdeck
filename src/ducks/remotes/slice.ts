import { type PayloadAction, createSlice } from '@reduxjs/toolkit'
import { type Remote } from '../../type/remote'
import { success, type ApiError } from '../../interfaces/api'
import { type FetchStatus, type PostStatus } from '../../utils/reqStatus'

interface RemotesState {
  domainData: {
    ids: string[]
    byId: Record<string, Remote>
  }
  appData: {
    selectedRemoteId: string | undefined
    fetchStatus: FetchStatus<ApiError>
    postNewRemoteStatus: PostStatus<ApiError>
    postEditedRemoteStatus: PostStatus<ApiError>
    postDeletedRemoteStatus: PostStatus<ApiError>
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
      fetchError: success
    },
    postEditedRemoteStatus: {
      isPosting: false,
      isPostFailed: false,
      postError: success
    },
    postNewRemoteStatus: {
      isPosting: false,
      isPostFailed: false,
      postError: success
    },
    postDeletedRemoteStatus: {
      isPosting: false,
      isPostFailed: false,
      postError: success
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

interface RemoteDeletedActionPayload {
  remoteId: string
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

    postNewRemote: (state, _: PayloadAction<PostNewRemotePayload>) => {
      state.appData.postNewRemoteStatus.isPosting = true
      state.appData.postNewRemoteStatus.isPostFailed = false
    },

    postNewRemoteFailure: (state, action: PayloadAction<{ error: ApiError }>) => {
      state.appData.postNewRemoteStatus.isPosting = false
      state.appData.postNewRemoteStatus.isPostFailed = true
      state.appData.postNewRemoteStatus.postError = action.payload.error
    },

    postNewRemoteSuccess: (state, action: PayloadAction<RemoteAddedActionPayload>) => {
      const payload = action.payload

      state.appData.postNewRemoteStatus.isPosting = false
      state.appData.postNewRemoteStatus.isPostFailed = false

      state.domainData.ids.push(payload.remoteId)
      state.domainData.byId[payload.remoteId] = {
        id: payload.remoteId,
        name: payload.remoteName,
        deviceId: payload.deviceId,
        tag: payload.tag
      }
    },

    postEditedRemote: (state, _: PayloadAction<PostEditedRemotePayload>) => {
      state.appData.postEditedRemoteStatus.isPosting = true
      state.appData.postEditedRemoteStatus.isPostFailed = false
    },

    postEditedRemoteFailure: (state, action: PayloadAction<{ error: ApiError }>) => {
      state.appData.postEditedRemoteStatus.isPosting = false
      state.appData.postEditedRemoteStatus.isPostFailed = true
      state.appData.postEditedRemoteStatus.postError = action.payload.error
    },

    postEditedRemoteSuccess: (state, action: PayloadAction<RemoteEditedActionPayload>) => {
      state.appData.postEditedRemoteStatus.isPosting = false
      state.appData.postEditedRemoteStatus.isPostFailed = false

      if (state.domainData.byId[action.payload.remoteId] === undefined) {
        return
      }
      state.domainData.byId[action.payload.remoteId].deviceId = action.payload.deviceId
      state.domainData.byId[action.payload.deviceId].name = action.payload.remoteName
    },

    postDeleteRemoteReq: (state, _: PayloadAction<{ remoteId: string }>) => {
      state.appData.postDeletedRemoteStatus.isPosting = true
      state.appData.postDeletedRemoteStatus.isPostFailed = false
    },

    postDeleteRemoteFailure: (state, action: PayloadAction<{ error: ApiError }>) => {
      state.appData.postDeletedRemoteStatus.isPostFailed = true
      state.appData.postDeletedRemoteStatus.isPosting = false
      state.appData.postDeletedRemoteStatus.postError = action.payload.error
    },

    postDeleteRemoteSuccess: (state, action: PayloadAction<{ deletedRemoteId: string }>) => {
      state.appData.postDeletedRemoteStatus.isPostFailed = false
      state.appData.postDeletedRemoteStatus.isPosting = false
      state.appData.postDeletedRemoteStatus.postError = success
      state.domainData.ids.filter((id) => id !== action.payload.deletedRemoteId)
    },

    remoteDeleted: (store, action: PayloadAction<RemoteDeletedActionPayload>) => {
      store.domainData.ids = store.domainData.ids.filter((id) => id !== action.payload.remoteId)
    }
  }
})

export const remoteReducer = remotesSlice.reducer

export const {
  selectRemote,
  fetchRemotes,
  fetchRemotesFailure,
  fetchRemotesSuccess,
  postEditedRemote,
  postEditedRemoteFailure,
  postEditedRemoteSuccess,
  postNewRemote,
  postNewRemoteFailure,
  postNewRemoteSuccess,
  postDeleteRemoteReq,
  postDeleteRemoteSuccess,
  postDeleteRemoteFailure
} = remotesSlice.actions
