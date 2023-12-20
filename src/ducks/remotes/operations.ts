import { type ActionCreator } from 'redux'
import { type ThunkActionFunc } from '../../app'
import { type AddRemoteReq } from '../../interfaces/api'
import { remoteAdded, remoteDeleted, remoteEdited, remotesFetched } from './domainSlice'
import { fetchRemoteFailure, fetchRemoteRequested, fetchRemoteSuccess } from './fetchStateSlice'
import { deleteRemoteFailure, deleteRemoteRequested, deleteRemoteSuccess, patchRemoteFailure, patchRemoteRequested, patchRemoteSuccess, postRemoteFailure, postRemoteRequested, postRemoteSuccess } from './requestStateSlice'
import { remoteSelected } from './selectedRemoteSlice'
import { selectedRemoteSelector } from './selector'

export const fetchRemotes: ActionCreator<
ThunkActionFunc
> = () => {
  return async (dispatch, getState, extra) => {
    dispatch(fetchRemoteRequested())
    const result = await extra.api.getRemotes()
    if (result.isError) {
      dispatch(fetchRemoteFailure({
        error: result.error
      }))
      return
    }
    dispatch(fetchRemoteSuccess())
    dispatch(remotesFetched({
      remotes: result.data
    }))

    const selectedRemote = selectedRemoteSelector(getState())
    if (selectedRemote !== null) {
      return
    }
    const firstRemote = result.data.at(0)
    if (firstRemote === undefined) {
      return
    }
    dispatch(remoteSelected({ remoteId: firstRemote.id }))
  }
}

export const postRemote = (req: AddRemoteReq): ThunkActionFunc => {
  return async (dispatch, _, extra) => {
    dispatch(postRemoteRequested())
    const result = await extra.api.addRemote(req)
    if (result.isError) {
      dispatch(postRemoteFailure({
        error: result.error
      }))
      return
    }
    const addedRemote = result.data
    dispatch(postRemoteSuccess())
    dispatch(remoteAdded({
      remoteId: addedRemote.id,
      remoteName: addedRemote.name,
      tag: addedRemote.tag,
      deviceId: addedRemote.deviceId
    }))
  }
}

export const patchRemote = (payload: { remoteId: string, remoteName: string, deviceId: string }): ThunkActionFunc => {
  return async (dispatch, _, extra) => {
    dispatch(patchRemoteRequested())
    const result = await extra.api.editRemotes(payload)
    if (result.isError) {
      dispatch(patchRemoteFailure({
        error: result.error
      }))
      return
    }
    dispatch(patchRemoteSuccess())
    dispatch(remoteEdited({
      ...payload
    }))
  }
}

export const deleteRemote = (payload: { remoteId: string }): ThunkActionFunc => {
  return async (dispatch, _, extra) => {
    dispatch(deleteRemoteRequested())
    const result = await extra.api.deleteRemotes(payload)
    if (result.isError) {
      dispatch(deleteRemoteFailure({
        error: result.error
      }))
      return
    }
    dispatch(deleteRemoteSuccess())
    dispatch(remoteDeleted({
      deletedRemoteId: payload.remoteId
    }))
  }
}
