import { type AppStartListening } from '../../app'
import { buttonsAdded, buttonsFetched } from '../buttons/domainSlice'
import { remoteAdded, remoteDeleted, remoteEdited, remotesFetched } from './domainSlice'
import { fetchRemotesFailure, fetchRemotesRequested, fetchRemotesSuccess } from './fetchStateSlice'
import { deleteRemoteFailure, deleteRemoteRequested, deleteRemoteSuccess, patchRemoteFailure, patchRemoteRequested, patchRemoteSuccess, postRemoteFailure, postRemoteRequested, postRemoteSuccess } from './requestStateSlice'
import { remoteSelected } from './selectedRemoteSlice'
import { remotesSelector, selectedRemoteIdSelector } from './selector'

const addFetchRemotesListener = (startListening: AppStartListening): void => {
  startListening({
    actionCreator: fetchRemotesRequested,
    effect: async (_, listenerApi) => {
      const selectedRemote = selectedRemoteIdSelector(listenerApi.getState())
      const result = await listenerApi.extra.api.fetchRemotes()
      if (result.isError) {
        listenerApi.dispatch(fetchRemotesFailure({
          error: result.error
        }))
        return
      }
      listenerApi.dispatch(fetchRemotesSuccess())
      listenerApi.dispatch(remotesFetched({ remotes: result.data.remotes }))
      console.log(result.data.buttons)
      listenerApi.dispatch(buttonsFetched({ buttons: result.data.buttons }))
      if (selectedRemote === null || !result.data.remotes.some(remotes => remotes.id === (selectedRemote))) {
        listenerApi.dispatch(remoteSelected({
          remoteId: result.data.remotes.at(0)?.id
        }))
      }
    }
  })
}

const addPostRemoteListener = (startListening: AppStartListening): void => {
  startListening({
    actionCreator: postRemoteRequested,
    effect: async (action, listenerApi) => {
      const result = await listenerApi.extra.api.createRemote(action.payload)
      if (result.isError) {
        listenerApi.dispatch(postRemoteFailure({
          error: result.error
        }))
        return
      }
      listenerApi.dispatch(postRemoteSuccess())
      listenerApi.dispatch(remoteSelected({
        remoteId: result.data.remote.id
      }))
      listenerApi.dispatch(remoteAdded({ remote: result.data.remote }))
      listenerApi.dispatch(buttonsAdded({ buttons: result.data.buttons }))
    }
  })
}

const addPatchRemoteListener = (startListening: AppStartListening): void => {
  startListening({
    actionCreator: patchRemoteRequested,
    effect: async (action, listenerApi) => {
      const { remoteId, remoteName, deviceId } = action.payload
      const result = await listenerApi.extra.api.updateRemotes(action.payload)
      if (result.isError) {
        listenerApi.dispatch(patchRemoteFailure({
          error: result.error
        }))
        return
      }
      listenerApi.dispatch(patchRemoteSuccess())
      listenerApi.dispatch(remoteEdited({
        remoteId,
        remoteName,
        deviceId
      }))
    }
  })
}

const addDeleteRemoteListener = (startListening: AppStartListening): void => {
  startListening({
    actionCreator: deleteRemoteRequested,
    effect: async (action, listenerApi) => {
      const { remoteId } = action.payload
      const result = await listenerApi.extra.api.deleteRemotes(action.payload)
      if (result.isError) {
        listenerApi.dispatch(deleteRemoteFailure({
          error: result.error
        }))
        return
      }
      listenerApi.dispatch(deleteRemoteSuccess())
      listenerApi.dispatch(remoteDeleted({
        deletedRemoteId: remoteId
      }))

      const remotes = remotesSelector(listenerApi.getState())
      const selectedRemote = selectedRemoteIdSelector(listenerApi.getState())
      if (selectedRemote === remoteId) {
        listenerApi.dispatch(remoteSelected({
          remoteId: remotes.at(0)?.id
        }))
      }
    }
  })
}

export const addRemoteListener = (startListening: AppStartListening): void => {
  addFetchRemotesListener(startListening)
  addPostRemoteListener(startListening)
  addPatchRemoteListener(startListening)
  addDeleteRemoteListener(startListening)
}
