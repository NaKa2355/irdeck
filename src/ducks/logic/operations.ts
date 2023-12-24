import { type AppStartListening } from '../../app'
import { fetchButtonsRequested } from '../buttons'
import { remoteSelected } from '../remotes'

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

export const addLogicalListener = (startListening: AppStartListening): void => {
  addRemoteSelectedListener(startListening)
}
