import { createSlice } from '@reduxjs/toolkit'

interface AddRemoteModalState {
  isOpen: boolean
}

const initialState: AddRemoteModalState = {
  isOpen: false
}

const addRemoteModalSlice = createSlice({
  name: 'ui.addRemoteModal',
  initialState,
  reducers: {
    addRemoteModalOpened: (state) => {
      state.isOpen = true
    },

    addRemoteModalClosed: (state) => {
      state.isOpen = false
    }
  }
})

export const addRemoteModalReducer = addRemoteModalSlice.reducer

export const {
  addRemoteModalClosed,
  addRemoteModalOpened
} = addRemoteModalSlice.actions
