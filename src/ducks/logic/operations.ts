import { type AppStartListening } from '../../app'
import { fetchButtonsRequested } from '../buttons'
import { remoteDeleted, remoteSelected, remotesSelector, selectedRemoteSelector } from '../remotes'

const addRemoteSelectedListener = (startListening: AppStartListening): void => {
  startListening({
    actionCreator: remoteSelected,
    effect: async (action, listenerApi) => {
      const { remoteId } = action.payload
      if (remoteId === null) {
        return
      }
      listenerApi.dispatch(fetchButtonsRequested({ remoteId }))
    }
  })
}

const addRemoteDeletedListener = (startListening: AppStartListening): void => {
  startListening({
    actionCreator: remoteDeleted,
    effect: async (action, listenerApi) => {
      const { deletedRemoteId } = action.payload
      const remotes = remotesSelector(listenerApi.getState())
      const selectedRemote = selectedRemoteSelector(listenerApi.getState())
      if (selectedRemote?.id === deletedRemoteId) {
        listenerApi.dispatch(remoteSelected({
          remoteId: remotes.at(0)?.id ?? null
        }))
      }
    }
  })
}

export const addLogicalListener = (startListening: AppStartListening): void => {
  addRemoteSelectedListener(startListening)
  addRemoteDeletedListener(startListening)
}
