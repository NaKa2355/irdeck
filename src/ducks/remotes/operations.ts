import { type ActionCreator } from 'redux'
import { type ThunkAsyncActionFunc } from '../../app'
import { type CreateRemoteReq } from '../../interfaces/api'
import { remoteAdded, remoteDeleted, remoteEdited, remotesFetched } from './domainSlice'
import { fetchRemoteFailure, fetchRemoteRequested, fetchRemoteSuccess } from './fetchStateSlice'
import { deleteRemoteFailure, deleteRemoteRequested, deleteRemoteSuccess, patchRemoteFailure, patchRemoteRequested, patchRemoteSuccess, postRemoteFailure, postRemoteRequested, postRemoteSuccess } from './requestStateSlice'
import { remoteSelected } from './selectedRemoteSlice'
import { remotesSelector, selectedRemoteSelector } from './selector'

export const fetchRemotes: ActionCreator<
ThunkAsyncActionFunc
> = () => {
  return async (dispatch, getState, extra) => {
    dispatch(fetchRemoteRequested())
    const result = await extra.api.fetchRemotes()
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

export const postRemote = (req: CreateRemoteReq): ThunkAsyncActionFunc => {
  return async (dispatch, _, extra) => {
    dispatch(postRemoteRequested())
    const result = await extra.api.createRemote(req)
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

export const patchRemote = (payload: { remoteId: string, remoteName: string, deviceId: string }): ThunkAsyncActionFunc => {
  return async (dispatch, _, extra) => {
    dispatch(patchRemoteRequested())
    const result = await extra.api.updateRemotes(payload)
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

export const deleteRemote = (payload: { remoteId: string }): ThunkAsyncActionFunc => {
  return async (dispatch, getState, extra) => {
    const selectedRemote = selectedRemoteSelector(getState())
    const remotes = remotesSelector(getState())
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
    if (selectedRemote === payload.remoteId) {
      dispatch(remoteSelected({
        remoteId: remotes.at(0)?.id ?? null
      }))
    }
  }
}
