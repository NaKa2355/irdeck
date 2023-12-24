import { combineReducers } from '@reduxjs/toolkit'
import { domainDeviceReducer } from './domainSlice'
import { fetchStateReducer } from './fechStateSlice'
import { requestStateReducer } from './requestStateSlice'
import { receivedIrDataReducer } from './receivedIrDataSlice'

// actions
export {
  sendIrDataRequested,
  clearSendIrDataStatus,
  receiveIrRequested,
  clearReceiveIrStatus
} from './requestStateSlice'
export {
  fetchDevicesRequested
} from './fechStateSlice'

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
  receiveIrDataStatusSelector,
  receivedIrDataSelector
} from './selector'

export {
  addDeviceListener
} from './operations'
