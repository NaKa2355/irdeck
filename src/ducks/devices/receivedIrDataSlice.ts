import { type PayloadAction, createSlice } from '@reduxjs/toolkit'
import { type IrData } from '../../type/irdata.type'

interface ReceivedIrData {
  irData: IrData | undefined
}

const initialState: ReceivedIrData = {
  irData: undefined
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
