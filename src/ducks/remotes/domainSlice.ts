import { type PayloadAction, createSlice } from '@reduxjs/toolkit'
import { type Remote } from '../../type/remote'

interface RemotesState {
  ids: string[]
  byId: Record<string, Remote>

}

const initialState: RemotesState = {
  ids: [],
  byId: {}
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
  name: 'domain.remotes',
  initialState,
  reducers: {
    remotesFetched: (state, action: PayloadAction<{ remotes: Remote[] }>) => {
      state.ids = action.payload.remotes.map((remote) => remote.id)
      action.payload.remotes.forEach((remote) => {
        state.byId[remote.id] = remote
      })
    },

    remoteAdded: (state, action: PayloadAction<RemoteAddedActionPayload>) => {
      const { remoteId, remoteName, deviceId, tag } = action.payload
      state.byId[remoteId] = {
        id: remoteId,
        name: remoteName,
        deviceId,
        tag
      }
      state.ids.push(remoteId)
    },

    remoteEdited: (state, action: PayloadAction<RemoteEditedActionPayload>) => {
      if (state.byId[action.payload.remoteId] === undefined) {
        return
      }
      state.byId[action.payload.remoteId].deviceId = action.payload.deviceId
      state.byId[action.payload.remoteId].name = action.payload.remoteName
    },

    remoteDeleted: (state, action: PayloadAction<{ deletedRemoteId: string }>) => {
      state.ids = state.ids.filter((id) => id !== action.payload.deletedRemoteId)
    }
  }
})

export const remoteDomainReducer = remotesSlice.reducer

export const {
  remoteAdded,
  remoteDeleted,
  remoteEdited,
  remotesFetched
} = remotesSlice.actions
