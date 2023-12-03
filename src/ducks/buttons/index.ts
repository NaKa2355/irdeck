import { combineReducers } from 'redux'
import { domainButtonsReducer } from './domainSlice'
import { requestStateReducer } from './requestStateSlice'
import { fetchStateReducer } from './fetchStateSlice'

// actions
export { pushButton, leanIrData } from './requestStateSlice'
export { fetchButtons } from './fetchStateSlice'

// selector
export { buttonsSelector } from './selector'

// operations
export { addButtonsListener } from './operations'

// reducer
export const buttonsReducer = combineReducers({
  domain: domainButtonsReducer,
  requestState: requestStateReducer,
  fetchState: fetchStateReducer
})
