import { combineReducers } from '@reduxjs/toolkit'
import { domainDeviceReducer } from './domainSlice'
import { fetchDevices, fetchStateReducer } from './fechStateSlice'
import { requestStateReducer, sendIr, receiveIr } from './requestStateSlice'
import { receivedIrDataReducer } from './receivedIrDataSlice'

export const devicesReducer = combineReducers({
  domain: domainDeviceReducer,
  fetchState: fetchStateReducer,
  requestState: requestStateReducer,
  receivedIrData: receivedIrDataReducer
})

export {
  fetchDevices,
  sendIr,
  receiveIr
}
