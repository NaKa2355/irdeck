import { type PayloadAction, createSlice } from '@reduxjs/toolkit'

interface SelectedRemote {
  id: string | null
}

const initialState: SelectedRemote = {
  id: null
}

const selectedRemoteSlice = createSlice({
  name: 'appdata.selectedRemote',
  initialState,
  reducers: {
    remoteSelected: (state, action: PayloadAction<{ remoteId: string }>) => {
      const { remoteId } = action.payload
      state.id = remoteId
    }
  }
})

export const selectedRemoteReducer = selectedRemoteSlice.reducer
export const {
  remoteSelected
} = selectedRemoteSlice.actions
