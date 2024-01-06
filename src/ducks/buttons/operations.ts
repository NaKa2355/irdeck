import { type AppStartListening } from '../../app'
import { buttonsFetched, irDataLearned } from './domainSlice'
import { fetchButtonsFailure, fetchButtonsRequested, fetchButtonsSuccess } from './fetchStateSlice'
import { learnIrDataFailure, learnIrDataRequested, learnIrDataSuccess, pushButtonFailure, pushButtonRequested, pushButtonSuccess } from './requestStateSlice'
import { fetchButtonsStatusSelector } from './selector'

const addPushButtonListener = (startListening: AppStartListening): void => {
  startListening({
    actionCreator: pushButtonRequested,
    effect: async (action, listenerApi) => {
      const { buttonId } = action.payload
      const result = await listenerApi.extra.api.pushButton({
        buttonId,
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
  addPushButtonListener(startListening)
  addLearnIrDataListener(startListening)
}
