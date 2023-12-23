import { type PayloadAction, createSlice } from '@reduxjs/toolkit'

interface AddRemoteModalState {
  isOpen: boolean
  remoteId: string | null
  buttonId: string | null
}

const initialState: AddRemoteModalState = {
  isOpen: false,
  remoteId: null,
  buttonId: null
}

const addRemoteModalSlice = createSlice({
  name: 'ui.learnIrModal',
  initialState,
  reducers: {
    learnIrModalOpened: (state, action: PayloadAction<{ remoteId: string, buttonId: string }>) => {
      const { remoteId, buttonId } = action.payload
      state.isOpen = true
      state.remoteId = remoteId
      state.buttonId = buttonId
    },

    learnIrModalClosed: (state) => {
      state.isOpen = false
    }
  }
})

export const learnIrModalReducer = addRemoteModalSlice.reducer

export const {
  learnIrModalClosed,
  learnIrModalOpened
} = addRemoteModalSlice.actions
