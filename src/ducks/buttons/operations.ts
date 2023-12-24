import { type AppStartListening } from '../../app'
import { remoteButtonsFetched } from '../remotes/domainSlice'
import { buttonsFetched, irDataLearned } from './domainSlice'
import { fetchButtonsFailure, fetchButtonsRequested, fetchButtonsSuccess } from './fetchStateSlice'
import { learnIrDataFailure, learnIrDataRequested, learnIrDataSuccess, pushButtonFailure, pushButtonRequested, pushButtonSuccess } from './requestStateSlice'

const addFetchButtonsListener = (startListening: AppStartListening): void => {
  startListening({
    actionCreator: fetchButtonsRequested,
    effect: async (action, listenerApi) => {
      const { remoteId } = action.payload
      if (remoteId === null) {
        return
      }
      const result = await listenerApi.extra.api.fetchButtons({ remoteId })
      if (result.isError) {
        listenerApi.dispatch(fetchButtonsFailure({
          remoteId,
          error: result.error
        }))
        return
      }
      listenerApi.dispatch(fetchButtonsSuccess({ remoteId }))
      listenerApi.dispatch(remoteButtonsFetched({
        remoteId,
        buttonIds: result.data.map((buttons) => buttons.id)
      }))
      listenerApi.dispatch(buttonsFetched({
        buttons: result.data
      }))
    }
  })
}

const addPushButtonListener = (startListening: AppStartListening): void => {
  startListening({
    actionCreator: pushButtonRequested,
    effect: async (action, listenerApi) => {
      const { buttonId } = action.payload
      const remoteId = listenerApi.getState().buttons.domain.byId[buttonId].remoteId
      const deviceId = listenerApi.getState().remotes.domain.byId[remoteId].deviceId
      const result = await listenerApi.extra.api.pushButton({
        remoteId,
        buttonId,
        deviceId
      })
      if (result.isError) {
        listenerApi.dispatch(pushButtonFailure({
          buttonId,
          error: result.error
        }))
        return
      }
      listenerApi.dispatch(pushButtonSuccess({ buttonId }))
    }
  })
}

const addLearnIrDataListener = (startlistening: AppStartListening): void => {
  startlistening({
    actionCreator: learnIrDataRequested,
    effect: async (action, listenerApi) => {
      const result = await listenerApi.extra.api.learnIrData(action.payload)
      if (result.isError) {
        listenerApi.dispatch(learnIrDataFailure({
          error: result.error
        }))
        return
      }
      listenerApi.dispatch(learnIrDataSuccess())
      listenerApi.dispatch(irDataLearned(action.payload))
    }
  })
}

export const addButtonsListener = (startListening: AppStartListening): void => {
  addFetchButtonsListener(startListening)
  addPushButtonListener(startListening)
  addLearnIrDataListener(startListening)
}
