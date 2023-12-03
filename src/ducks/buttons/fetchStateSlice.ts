import { type PayloadAction, createSlice } from '@reduxjs/toolkit'
import { type FetchStatus } from '../../utils/reqStatus'
import { type ApiError } from '../../interfaces/api'

interface FetchState {
  fetchStatus: Record<string, FetchStatus<ApiError> | undefined>
}

const initialState: FetchState = {
  fetchStatus: {}
}

const fetchStateSlice = createSlice({
  name: 'fetchState.buttons',
  initialState,
  reducers: {
    fetchButtons: (state, action: PayloadAction<{ remoteId: string }>) => {
      const { remoteId } = action.payload
      const status = state.fetchStatus[remoteId]
      if (status === undefined) {
        state.fetchStatus[remoteId] = {
          isCached: false,
          isFetchFailed: false,
          isFetching: true,
          fetchError: undefined
        }
        return
      }
      status.isFetching = true
    },
    fetchButtonsFailure: (state, action: PayloadAction<{ remoteId: string, error: ApiError }>) => {
      const { remoteId, error } = action.payload
      const status = state.fetchStatus[remoteId]
      if (status === undefined) {
        return
      }
      status.isFetchFailed = true
      status.fetchError = error
      status.isFetching = false
    },
    fetchButtonsSuccess: (state, action: PayloadAction<{ remoteId: string }>) => {
      const { remoteId } = action.payload
      const status = state.fetchStatus[remoteId]
      if (status === undefined) {
        return
      }
      status.isFetchFailed = true
      status.isCached = true
      status.isFetching = false
    }
  }
})

export const {
  fetchButtons,
  fetchButtonsFailure,
  fetchButtonsSuccess
} = fetchStateSlice.actions

export const fetchStateReducer = fetchStateSlice.reducer