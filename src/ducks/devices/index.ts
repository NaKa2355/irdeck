import { combineReducers } from '@reduxjs/toolkit'
import { domainDeviceReducer } from './domainSlice'
import { fetchStateReducer } from './fechStateSlice'
import { requestStateReducer } from './requestStateSlice'
import { receivedIrDataReducer } from './receivedIrDataSlice'

// actions
export { tryIrData, receiveIr, fetchDevices } from './operations'

// reducer
export const devicesReducer = combineReducers({
  domain: domainDeviceReducer,
  fetchState: fetchStateReducer,
  requestState: requestStateReducer,
  receivedIrData: receivedIrDataReducer
})

// selectors
export {
  devicesCanReceiveSelector,
  devicesCanSendSelector,
  receivedIrDataSelector
} from './selector'
