import { type AppStartListening } from '../../app'
import { remoteAdded, remoteDeleted, remoteEdited, remotesFetched } from './domainSlice'
import { fetchRemoteFailure, fetchRemoteRequested, fetchRemoteSuccess } from './fetchStateSlice'
import { deleteRemoteFailure, deleteRemoteRequested, deleteRemoteSuccess, patchRemoteFailure, patchRemoteRequested, patchRemoteSuccess, postRemoteFailure, postRemoteRequested, postRemoteSuccess } from './requestStateSlice'
import { remoteSelected } from './selectedRemoteSlice'
import { remotesSelector, selectedRemoteSelector } from './selector'

const addFetchRemoteListener = (startListening: AppStartListening): void => {
  startListening({
    actionCreator: fetchRemoteRequested,
    effect: async (_, listenerApi) => {
      const selectedRemote = selectedRemoteSelector(listenerApi.getState())
      const result = await listenerApi.extra.api.fetchRemotes()
      if (result.isError) {
        listenerApi.dispatch(fetchRemoteFailure({
          error: result.error
        }))
        return
      }
      listenerApi.dispatch(fetchRemoteSuccess())
      listenerApi.dispatch(remotesFetched({
        remotes: result.data
      }))
      if (selectedRemote === null) {
        listenerApi.dispatch(remoteSelected({
          remoteId: result.data.at(0)?.id ?? null
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
        remoteId: result.data.id
      }))
      listenerApi.dispatch(remoteAdded({
        remoteId: result.data.id,
        remoteName: result.data.name,
        tag: result.data.tag,
        deviceId: result.data.deviceId
      }))
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
      const selectedRemote = selectedRemoteSelector(listenerApi.getState())
      if (selectedRemote?.id === remoteId) {
        listenerApi.dispatch(remoteSelected({
          remoteId: remotes.at(0)?.id ?? null
        }))
      }
    }
  })
}

export const addRemoteListener = (startListening: AppStartListening): void => {
  addFetchRemoteListener(startListening)
  addPostRemoteListener(startListening)
  addPatchRemoteListener(startListening)
  addDeleteRemoteListener(startListening)
}
