import { type PayloadAction, createSlice } from '@reduxjs/toolkit'
import { type IrData } from '../../type/irdata.type'
import { type DeviceId } from '../../type/device.type'

interface ReceivedIrData {
  irData: Record<DeviceId, IrData | undefined>
}

const initialState: ReceivedIrData = {
  irData: {}
}

const ReceivedIrDataSlice = createSlice({
  name: 'appData.receivedIrData',
  initialState,
  reducers: {
    irDataReceived: (state, action: PayloadAction<{ deviceId: DeviceId, irData: IrData }>) => {
      const { deviceId, irData } = action.payload
      state.irData[deviceId] = irData
    }
  }
})

export const receivedIrDataReducer = ReceivedIrDataSlice.reducer

export const {
  irDataReceived
} = ReceivedIrDataSlice.actions
