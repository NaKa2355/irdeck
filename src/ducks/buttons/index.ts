import { combineReducers } from 'redux'
import { domainButtonsReducer } from './domainSlice'
import { requestStateReducer } from './requestStateSlice'

// actions
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
  requestState: requestStateReducer
})

export {
  addButtonsListener
} from './operations'
