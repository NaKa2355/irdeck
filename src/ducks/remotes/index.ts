import { combineReducers } from 'redux'
import { remoteDomainReducer } from './domainSlice'
import { fetchRemotesStateReducer } from './fetchStateSlice'
import { requestStateReducer } from './requestStateSlice'
import { selectedRemoteReducer } from './selectedRemoteSlice'

// actions
export { remoteSelected } from './selectedRemoteSlice'
export {
  deleteRemoteRequested,
  clearDeleteRemoteStatus,
  patchRemoteRequested,
  clearPatchRemoteStatus,
  postRemoteRequested,
  clearPostRemoteStatus
} from './requestStateSlice'
export { remoteAdded, remoteEdited, remoteDeleted } from './domainSlice'

// selector
export {
  selectedRemoteIdSelector,
  remotesSelector,
  remoteSelector,
  fetchRemoteStatusSelector,
  postRemoteStatusSelector,
  patchRemoteStatusSelector,
  deleteRemoteStatusSelector
} from './selector'

// reducer
export const remoteReducer = combineReducers({
  domain: remoteDomainReducer,
  fetch: fetchRemotesStateReducer,
  request: requestStateReducer,
  selectedRemote: selectedRemoteReducer
})

export {
  addRemoteListener
} from './operations'
