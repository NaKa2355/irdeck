import { type PayloadAction, createSlice } from '@reduxjs/toolkit'

type SnackBarSeverity = 'error' | 'warning' | 'info' | 'success'

interface UiState {
  snackBar: {
    severity: SnackBarSeverity
    isShown: boolean
  }
}

const initialState: UiState = {
  snackBar: {
    severity: 'success',
    isShown: false
  }
}

const snackBarSlice = createSlice({
  name: 'ui.snackbar',
  initialState,
  reducers: {
    snackBarShown: (state, action: PayloadAction<{ severity: SnackBarSeverity }>) => {
      state.snackBar.severity = action.payload.severity
      state.snackBar.isShown = true
    },

    snackBarHidden: (state) => {
      state.snackBar.isShown = false
    }
  }
})

export const snackBarReducer = snackBarSlice.reducer

export const {
  snackBarHidden,
  snackBarShown
} = snackBarSlice.actions
