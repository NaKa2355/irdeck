import { type PayloadAction, createSlice } from '@reduxjs/toolkit'
import { type Button } from '../../type/button'

interface ButtonsState {
  byId: Record<string, Button>
  ids: Record<string, string[] | undefined>
}

const initialState: ButtonsState = {
  byId: {},
  ids: {}
}

const buttonsSlice = createSlice({
  name: 'domain.buttons',
  initialState,
  reducers: {
    buttonsFetched: (state, action: PayloadAction<{ buttons: Button[], remoteId: string }>) => {
      const { remoteId, buttons } = action.payload
      buttons.forEach((device) => {
        state.byId[device.id] = device
      })
      state.ids[remoteId] = buttons.map(buttons => buttons.id)
    },
    irDataLearned: (state, action: PayloadAction<{ buttonId: string }>) => {
      const { buttonId } = action.payload
      state.byId[buttonId].hasIrData = true
    }
  }
})

export const {
  buttonsFetched,
  irDataLearned
} = buttonsSlice.actions
export const domainButtonsReducer = buttonsSlice.reducer
