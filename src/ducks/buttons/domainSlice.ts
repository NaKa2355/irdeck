import { type PayloadAction, createSlice } from '@reduxjs/toolkit'
import { type ButtonId, type Button } from '../../type/button'
import { type RemoteId } from '../../type/remote'

interface ButtonsState {
  byId: Record<ButtonId, Button>
  ids: Record<RemoteId, string[] | undefined>
}

const initialState: ButtonsState = {
  byId: {},
  ids: {}
}

const buttonsSlice = createSlice({
  name: 'domain.buttons',
  initialState,
  reducers: {
    buttonsFetched: (state, action: PayloadAction<{ buttons: Button[], remoteId: RemoteId }>) => {
      const { remoteId, buttons } = action.payload
      buttons.forEach((device) => {
        state.byId[device.id] = device
      })
      state.ids[remoteId] = buttons.map(buttons => buttons.id)
    },
    irDataLearned: (state, action: PayloadAction<{ buttonId: ButtonId }>) => {
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
