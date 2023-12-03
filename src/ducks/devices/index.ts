import { combineReducers } from '@reduxjs/toolkit'
import { domainDeviceReducer } from './domainSlice'
import { fetchStateReducer } from './fechStateSlice'
import { requestStateReducer } from './requestStateSlice'
import { receivedIrDataReducer } from './receivedIrDataSlice'

// actions
export { fetchDevices } from './fechStateSlice'
export { sendIr, receiveIr } from './requestStateSlice'

// operations
export { addDevicesListener } from './operations'

// reducer
export const devicesReducer = combineReducers({
  domain: domainDeviceReducer,
  fetchState: fetchStateReducer,
  requestState: requestStateReducer,
  receivedIrData: receivedIrDataReducer
})
