import { combineReducers } from 'redux'
import { domainButtonsReducer } from './domainSlice'
import { requestStateReducer } from './requestStateSlice'
import { fetchStateReducer } from './fetchStateSlice'

// actions
export { fetchButtonsRequested } from './fetchStateSlice'
export {
  pushButtonRequested,
  clearPushButtonStatus
} from './requestStateSlice'
export { irDataLearned } from './domainSlice'

// selector
export { buttonsSelector } from './selector'

// reducer
export const buttonsReducer = combineReducers({
  domain: domainButtonsReducer,
  requestState: requestStateReducer,
  fetchState: fetchStateReducer
})
