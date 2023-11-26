import { listenerMiddleware } from '../../store/store'
import { fetchRemotes, fetchRemotesFailure, fetchRemotesSuccess, postDeleteRemoteFailure, postDeleteRemoteReq, postDeleteRemoteSuccess, postEditedRemote, postEditedRemoteFailure, postEditedRemoteSuccess, postNewRemote, postNewRemoteFailure, postNewRemoteSuccess, selectRemote } from './slice'

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
  actionCreator: postNewRemote,
  effect: async (action, api) => {
    if (api.getState().remotes.appData.postNewRemoteStatus.isPosting) {
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
      api.dispatch(postNewRemoteFailure({
        error: result.error
      }))
      return
    }
    api.dispatch(postNewRemoteSuccess({
      remoteId: result.data.id,
      remoteName: result.data.name,
      deviceId: result.data.deviceId,
      tag: result.data.id
    }))
  }
})

// posted edited remote
listenerMiddleware.startListening({
  actionCreator: postEditedRemote,
  effect: async (action, api) => {
    const payload = action.payload
    const result = await api.extra.api.editRemotes({
      remoteId: payload.remoteId,
      remoteName: payload.remoteName,
      deviceId: payload.deviceId
    })
    if (result.isError) {
      api.dispatch(postEditedRemoteFailure({
        error: result.error
      }))
      return
    }
    api.dispatch(postEditedRemoteSuccess({
      remoteId: payload.remoteId,
      remoteName: payload.remoteName,
      deviceId: payload.deviceId
    }))
  }
})

listenerMiddleware.startListening({
  actionCreator: postDeleteRemoteReq,
  effect: async (action, api) => {
    if (api.getState().remotes.appData.postEditedRemoteStatus.isPosting) {
      return
    }
    const payload = action.payload
    const result = await api.extra.api.deleteRemotes({
      remoteId: payload.remoteId
    })
    if (result.isError) {
      api.dispatch(postDeleteRemoteFailure({
        error: result.error
      }))
      return
    }
    api.dispatch(postDeleteRemoteSuccess({
      deletedRemoteId: action.payload.remoteId
    }))
  }
})
