import { type AppStartListening } from '../../app'
import { remoteAdded, remoteDeleted, remoteEdited, remotesFetched } from './domainSlice'
import { fetchRemote, fetchRemoteFailure, fetchRemoteSuccess } from './fetchStateSlice'
import { deleteRemote, deleteRemoteFailure, deleteRemoteSuccess, patchRemote, patchRemoteFailure, patchRemoteSuccess, postRemote, postRemoteFailure, postRemoteSuccess } from './requestStateSlice'
import { remoteSelected } from './selectedRemoteSlice'
import { selectedRemoteSelector } from './selector'

const addFetchRemotesListener = (startListening: AppStartListening): void => {
  startListening({
    actionCreator: fetchRemote,
    effect: async (_, api) => {
      const result = await api.extra.api.getRemotes()
      if (result.isError) {
        api.dispatch(fetchRemoteFailure({
          error: result.error
        }))
        return
      }
      api.dispatch(fetchRemoteSuccess())
      api.dispatch(remotesFetched({
        remotes: result.data
      }))
      const selectedRemote = selectedRemoteSelector(api.getState())
      if (selectedRemote !== null) {
        return
      }
      const firstRemote = result.data.at(0)
      if (firstRemote === undefined) {
        return
      }
      api.dispatch(remoteSelected({ remoteId: firstRemote.id }))
    }
  })
}

const addPostRemoteListener = (startListening: AppStartListening): void => {
  startListening({
    actionCreator: postRemote,
    effect: async (action, api) => {
      const payload = action.payload
      const result = await api.extra.api.addRemote({
        remoteName: payload.remoteName,
        tag: payload.tag,
        deviceId: payload.deviceId,
        buttons: payload.buttons
      })
      if (result.isError) {
        api.dispatch(postRemoteFailure({
          error: result.error
        }))
        return
      }
      api.dispatch(postRemoteSuccess())
      api.dispatch(remoteAdded({
        remoteId: result.data.id,
        remoteName: result.data.name,
        tag: result.data.tag,
        deviceId: result.data.deviceId
      }))
    }
  })
}

// posted edited remote
const addPatchRemoteListener = (startListening: AppStartListening): void => {
  startListening({
    actionCreator: patchRemote,
    effect: async (action, api) => {
      const { remoteId, remoteName, deviceId } = action.payload
      const result = await api.extra.api.editRemotes({
        remoteId,
        remoteName,
        deviceId
      })
      if (result.isError) {
        api.dispatch(patchRemoteFailure({
          error: result.error
        }))
        return
      }
      api.dispatch(patchRemoteSuccess())
      api.dispatch(remoteEdited({
        remoteId,
        remoteName,
        deviceId
      }))
    }
  })
}

const addDeleteRemoteListener = (startListening: AppStartListening): void => {
  startListening({
    actionCreator: deleteRemote,
    effect: async (action, api) => {
      const { remoteId } = action.payload
      const result = await api.extra.api.deleteRemotes({
        remoteId
      })
      if (result.isError) {
        api.dispatch(deleteRemoteFailure({
          error: result.error
        }))
        return
      }
      api.dispatch(deleteRemoteSuccess())
      api.dispatch(remoteDeleted({
        deletedRemoteId: remoteId
      }))
    }
  })
}

export const addRemotesListener = (startListening: AppStartListening): void => {
  addDeleteRemoteListener(startListening)
  addFetchRemotesListener(startListening)
  addPatchRemoteListener(startListening)
  addPostRemoteListener(startListening)
}
