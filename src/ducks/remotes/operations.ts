import { listenerMiddleware } from '../../store/store'
import { deleteRemote, deleteRemoteFailure, deleteRemoteSuccess, fetchRemotes, fetchRemotesFailure, fetchRemotesSuccess, patchRemote, patchRemoteFailure, patchRemoteSuccess, postRemote, postRemoteFailure, postRemoteSuccess, selectRemote } from './slice'

// fetched remote
listenerMiddleware.startListening({
  actionCreator: fetchRemotes,
  effect: async (_, api) => {
    if (api.getState().remotes.appData.fetchStatus.isFetching) {
      return
    }
    const result = await api.extra.api.getRemotes()
    if (result.isError) {
      api.dispatch(fetchRemotesFailure({
        error: result.error
      }))
      return
    }
    api.dispatch(fetchRemotesSuccess({
      remotes: result.data
    }))
    api.dispatch(selectRemote({
      remoteId: result.data.pop()?.id
    }))
  }
})

// posted new remote
listenerMiddleware.startListening({
  actionCreator: postRemote,
  effect: async (action, api) => {
    if (api.getState().remotes.appData.postRemoteStatus.isPending) {
      return
    }
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
    api.dispatch(postRemoteSuccess({
      remoteId: result.data.id,
      remoteName: result.data.name,
      deviceId: result.data.deviceId,
      tag: result.data.id
    }))
  }
})

// posted edited remote
listenerMiddleware.startListening({
  actionCreator: patchRemote,
  effect: async (action, api) => {
    const payload = action.payload
    const result = await api.extra.api.editRemotes({
      remoteId: payload.remoteId,
      remoteName: payload.remoteName,
      deviceId: payload.deviceId
    })
    if (result.isError) {
      api.dispatch(patchRemoteFailure({
        error: result.error
      }))
      return
    }
    api.dispatch(patchRemoteSuccess({
      remoteId: payload.remoteId,
      remoteName: payload.remoteName,
      deviceId: payload.deviceId
    }))
  }
})

listenerMiddleware.startListening({
  actionCreator: deleteRemote,
  effect: async (action, api) => {
    if (api.getState().remotes.appData.deleteRemoteStatus.isPending) {
      return
    }
    const payload = action.payload
    const result = await api.extra.api.deleteRemotes({
      remoteId: payload.remoteId
    })
    if (result.isError) {
      api.dispatch(deleteRemoteFailure({
        error: result.error
      }))
      return
    }
    api.dispatch(deleteRemoteSuccess({
      deletedRemoteId: action.payload.remoteId
    }))
  }
})
