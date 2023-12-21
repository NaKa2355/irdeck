import { type PayloadAction, createSlice } from '@reduxjs/toolkit'

type SnackBarSeverity = 'error' | 'warning' | 'info' | 'success'

interface UiState {
  snackBar: {
    severity: SnackBarSeverity
    message: string
    isShown: boolean
  }
}

const initialState: UiState = {
  snackBar: {
    message: '',
    severity: 'success',
    isShown: false
  }
}

const snackBarSlice = createSlice({
  name: 'ui.snackbar',
  initialState,
  reducers: {
    snackBarShown: (state, action: PayloadAction<{ message: string, severity: SnackBarSeverity }>) => {
      const { severity, message } = action.payload
      state.snackBar = {
        severity,
        message,
        isShown: true
      }
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
