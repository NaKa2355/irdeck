import { type PayloadAction, createSlice } from '@reduxjs/toolkit'
import { type IrData } from '../../type/irdata.type'

interface ReceivedIrData {
  irData: IrData
}

const initialState: ReceivedIrData = {
  irData: new Uint8Array()
}

const ReceivedIrDataSlice = createSlice({
  name: 'appData.receivedIrData',
  initialState,
  reducers: {
    irDataReceived: (state, action: PayloadAction<{ irData: IrData }>) => {
      const { irData } = action.payload
      state.irData = irData
    }
  }
})

export const receivedIrDataReducer = ReceivedIrDataSlice.reducer

export const {
  irDataReceived
} = ReceivedIrDataSlice.actions
