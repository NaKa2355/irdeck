import { combineReducers } from 'redux'
import { remoteDomainReducer } from './domainSlice'
import { fetchRemote, fetchRemotesStateReducer } from './fetchStateSlice'
import { deleteRemote, patchRemote, postRemote, requestStateReducer } from './requestStateSlice'
import { selectedRemoteReducer, remoteSelected } from './selectedRemoteSlice'

export const remoteReducer = combineReducers({
  domain: remoteDomainReducer,
  fetch: fetchRemotesStateReducer,
  request: requestStateReducer,
  selectedRemote: selectedRemoteReducer
})

export {
  postRemote,
  patchRemote,
  deleteRemote,
  fetchRemote,
  remoteSelected
}
