import { type PayloadAction, createSlice } from '@reduxjs/toolkit'
import { type FetchStatus } from '../../utils/reqStatus'
import { type ApiError } from '../../interfaces/api'

interface FetchState {
  fetchStatus: {
    remotes: FetchStatus<ApiError>
  }
}

const initialState: FetchState = {
  fetchStatus: {
    remotes: {
      isCached: false,
      isFetchFailed: false,
      fetchError: undefined,
      isFetching: false
    }
  }
}

const fetchStateSlice = createSlice({
  name: 'fetchState.remotes',
  initialState,
  reducers: {
    fetchRemotesRequested: (state) => {
      state.fetchStatus.remotes.isFetching = true
    },
    fetchRemotesFailure: (state, action: PayloadAction<{ error: ApiError }>) => {
      const error = action.payload.error
      state.fetchStatus.remotes.fetchError = error
      state.fetchStatus.remotes.isFetchFailed = false
      state.fetchStatus.remotes.isFetching = false
    },
    fetchRemotesSuccess: (state) => {
      state.fetchStatus.remotes.isFetchFailed = false
      state.fetchStatus.remotes.isCached = true
      state.fetchStatus.remotes.isFetching = false
    }
  }
})

export const {
  fetchRemotesRequested,
  fetchRemotesFailure,
  fetchRemotesSuccess
} = fetchStateSlice.actions

export const fetchRemotesStateReducer = fetchStateSlice.reducer
