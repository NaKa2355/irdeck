import { combineReducers } from 'redux'
import { domainButtonsReducer } from './domainSlice'
import { requestStateReducer } from './requestStateSlice'
import { fetchStateReducer } from './fetchStateSlice'

// actions
export { fetchButtons, pushButton } from './operations'
export { clearPushButtonStatus } from './requestStateSlice'
export { irDataLearned } from './domainSlice'

// selector
export { buttonsSelector } from './selector'

// reducer
export const buttonsReducer = combineReducers({
  domain: domainButtonsReducer,
  requestState: requestStateReducer,
  fetchState: fetchStateReducer
})
