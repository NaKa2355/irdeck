import { type PayloadAction, createSlice } from '@reduxjs/toolkit'

type ModalType = 'addRemote' | 'editRemote' | 'receiving'

type SnackBarSeverity = 'error' | 'warning' | 'info' | 'success'

interface UiState {
  modal: {
    modalType: ModalType
    isOpen: boolean
  }
  snackBar: {
    severity: SnackBarSeverity
    isShown: boolean
  }
}

const initialState: UiState = {
  modal: {
    modalType: 'addRemote',
    isOpen: false
  },
  snackBar: {
    severity: 'success',
    isShown: false
  }
}

const uiStateSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    modalOpened: (state, action: PayloadAction<{ modalType: ModalType }>) => {
      state.modal.modalType = action.payload.modalType
      state.modal.isOpen = true
    },

    modalClosed: (state) => {
      state.modal.isOpen = false
    },

    snackBarShown: (state, action: PayloadAction<{ severity: SnackBarSeverity }>) => {
      state.snackBar.severity = action.payload.severity
      state.snackBar.isShown = true
    },

    snackBarHidden: (state) => {
      state.snackBar.isShown = false
    }
  }
})

export const uiStateReducer = uiStateSlice.reducer

export const {
  modalOpened,
  modalClosed,
  snackBarHidden,
  snackBarShown
} = uiStateSlice.actions
