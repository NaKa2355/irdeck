import { createSlice } from '@reduxjs/toolkit'

interface AddRemoteModalState {
  isOpen: boolean
  state: 'standby' | 'receiving' | 'timeout' | 'failed' | 'success'
}

const initialState: AddRemoteModalState = {
  isOpen: false,
  state: 'standby'
}

const addRemoteModalSlice = createSlice({
  name: 'ui.learnIrModal',
  initialState,
  reducers: {
    learnIrModalOpened: (state) => {
      state.isOpen = true
      state.state = 'standby'
    },

    learnIrModalClosed: (state) => {
      state.isOpen = false
    },
    leanIrFailed: (state) => {
      state.state = 'failed'
    }
  }
})

export const learnIrModalReducer = addRemoteModalSlice.reducer

export const {
  learnIrModalClosed,
  learnIrModalOpened
} = addRemoteModalSlice.actions
