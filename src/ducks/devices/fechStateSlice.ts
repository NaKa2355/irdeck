import { type PayloadAction, createSlice } from '@reduxjs/toolkit'
import { type FetchStatus } from '../../utils/reqStatus'
import { type ApiError } from '../../interfaces/api'

interface FetchState {
  fetchStatus: FetchStatus<ApiError>
}

const initialState: FetchState = {
  fetchStatus: {
    isCached: false,
    isFetchFailed: false,
    fetchError: undefined,
    isFetching: false
  }
}

const fetchStateSlice = createSlice({
  name: 'fetchState.devices',
  initialState,
  reducers: {
    fetchDevices: (state) => {
      state.fetchStatus.isFetching = true
    },
    fetchDevicesFailure: (state, action: PayloadAction<{ error: ApiError }>) => {
      const error = action.payload.error
      state.fetchStatus.fetchError = error
      state.fetchStatus.isFetchFailed = false
      state.fetchStatus.isFetching = false
    },
    fetchDevicesSuccess: (state) => {
      state.fetchStatus.isFetchFailed = false
      state.fetchStatus.isCached = true
      state.fetchStatus.isFetching = false
    }
  }
})

export const {
  fetchDevices,
  fetchDevicesFailure,
  fetchDevicesSuccess
} = fetchStateSlice.actions

export const fetchStateReducer = fetchStateSlice.reducer
