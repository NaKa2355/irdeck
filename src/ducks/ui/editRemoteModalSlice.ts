import { type PayloadAction, createSlice } from '@reduxjs/toolkit'

interface ModalState {
  isOpen: boolean
  editingRemote: string
}

const initialState: ModalState = {
  isOpen: false,
  editingRemote: ''
}

const editRemoteModalSlice = createSlice({
  name: 'ui.addRemoteEditModal',
  initialState,
  reducers: {
    editRemoteModalOpened: (state, action: PayloadAction<{ remoteId: string }>) => {
      const { remoteId } = action.payload
      state.isOpen = true
      state.editingRemote = remoteId
    },

    editRemoteModalClosed: (state) => {
      state.isOpen = false
    }
  }
})

export const editRemoteModalReducer = editRemoteModalSlice.reducer

export const {
  editRemoteModalClosed,
  editRemoteModalOpened
} = editRemoteModalSlice.actions
