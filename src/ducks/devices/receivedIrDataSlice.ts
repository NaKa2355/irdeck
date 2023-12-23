import { type PayloadAction, createSlice } from '@reduxjs/toolkit'
import { type IrData } from '../../type/irdata.type'

interface ReceivedIrData {
  irData: Record<string, IrData | undefined>
}

const initialState: ReceivedIrData = {
  irData: {}
}

const ReceivedIrDataSlice = createSlice({
  name: 'appData.receivedIrData',
  initialState,
  reducers: {
    irDataReceived: (state, action: PayloadAction<{ deviceId: string, irData: IrData }>) => {
      const { deviceId, irData } = action.payload
      state.irData[deviceId] = irData
    }
  }
})

export const receivedIrDataReducer = ReceivedIrDataSlice.reducer

export const {
  irDataReceived
} = ReceivedIrDataSlice.actions
