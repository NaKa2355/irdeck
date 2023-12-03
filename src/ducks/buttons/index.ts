import { combineReducers } from 'redux'
import { domainButtonsReducer } from './domainSlice'
import { pushButton, leanIrData, requestStateReducer } from './requestStateSlice'
import { fetchButtons, fetchStateReducer } from './fetchStateSlice'

export const buttonsReducer = combineReducers({
  domain: domainButtonsReducer,
  requestState: requestStateReducer,
  fetchState: fetchStateReducer
})

export {
  pushButton,
  leanIrData,
  fetchButtons
}
