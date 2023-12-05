import { combineReducers } from 'redux'
import { remoteDomainReducer } from './domainSlice'
import { fetchRemotesStateReducer } from './fetchStateSlice'
import { requestStateReducer } from './requestStateSlice'
import { selectedRemoteReducer } from './selectedRemoteSlice'

// actions
export { fetchRemote } from './fetchStateSlice'
export { postRemote, patchRemote, deleteRemote } from './requestStateSlice'
export { remoteSelected } from './selectedRemoteSlice'

// selector
export {
  selectedRemoteSelector,
  remotesSelector,
  remoteSelector,
  fetchRemoteStatusSelector
} from './selector'

// operations
export { addRemotesListener } from './operations'

// reducer
export const remoteReducer = combineReducers({
  domain: remoteDomainReducer,
  fetch: fetchRemotesStateReducer,
  request: requestStateReducer,
  selectedRemote: selectedRemoteReducer
})
