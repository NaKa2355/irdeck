import { combineReducers } from 'redux'
import { remoteDomainReducer } from './domainSlice'
import { fetchRemote, fetchRemotesStateReducer } from './fetchStateSlice'
import { deleteRemote, patchRemote, postRemote, requestStateReducer } from './requestStateSlice'

export const remoteReducer = combineReducers({
  domain: remoteDomainReducer,
  fetch: fetchRemotesStateReducer,
  request: requestStateReducer
})

export {
  postRemote,
  patchRemote,
  deleteRemote,
  fetchRemote
}
