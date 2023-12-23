import { combineReducers } from 'redux'
import { remoteDomainReducer } from './domainSlice'
import { fetchRemotesStateReducer } from './fetchStateSlice'
import { requestStateReducer } from './requestStateSlice'
import { selectedRemoteReducer } from './selectedRemoteSlice'

// actions
export { fetchRemotes } from './operations'
export { remoteSelected } from './selectedRemoteSlice'
export { clearDeleteRemoteStatus, clearPatchRemoteStatus, clearPostRemoteStatus } from './requestStateSlice'
export { remoteAdded, remoteEdited, remoteDeleted } from './domainSlice'

// selector
export {
  selectedRemoteSelector,
  remotesSelector,
  remoteSelector,
  fetchRemoteStatusSelector,
  postRemoteStatusSelector,
  patchRemoteStatusSelector
} from './selector'

// reducer
export const remoteReducer = combineReducers({
  domain: remoteDomainReducer,
  fetch: fetchRemotesStateReducer,
  request: requestStateReducer,
  selectedRemote: selectedRemoteReducer
})
