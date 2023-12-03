import { listenerMiddleware } from '../../store/store'
import { remoteAdded, remoteDeleted, remoteEdited, remotesFetched } from './domainSlice'
import { fetchRemote, fetchRemoteFailure, fetchRemoteSuccess } from './fetchStateSlice'
import { deleteRemote, deleteRemoteFailure, deleteRemoteSuccess, patchRemote, patchRemoteFailure, patchRemoteSuccess, postRemote, postRemoteFailure, postRemoteSuccess } from './requestStateSlice'

// fetched remote
listenerMiddleware.startListening({
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
  }
})

// posted new remote
listenerMiddleware.startListening({
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

// posted edited remote
listenerMiddleware.startListening({
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

listenerMiddleware.startListening({
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
