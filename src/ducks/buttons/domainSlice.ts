import { type PayloadAction, createSlice } from '@reduxjs/toolkit'
import { type ButtonId, type Button } from '../../type/button'

interface ButtonsState {
  byId: Record<ButtonId, Button>
}

const initialState: ButtonsState = {
  byId: {}
}

const buttonsSlice = createSlice({
  name: 'domain.buttons',
  initialState,
  reducers: {
    buttonsFetched: (state, action: PayloadAction<{ buttons: Button[] }>) => {
      const { buttons } = action.payload
      buttons.forEach((device) => {
        state.byId[device.id] = device
      })
    },
    buttonsAdded: (state, action: PayloadAction<{ buttons: Button[] }>) => {
      const { buttons } = action.payload
      buttons.forEach((device) => {
        state.byId[device.id] = device
      })
    },
    irDataLearned: (state, action: PayloadAction<{ buttonId: ButtonId }>) => {
      const { buttonId } = action.payload
      state.byId[buttonId].hasIrData = true
    }
  }
})

export const {
  buttonsFetched,
  buttonsAdded,
  irDataLearned
} = buttonsSlice.actions
export const domainButtonsReducer = buttonsSlice.reducer
