import { type AppStartListening } from '../../app'
import { buttonsFetched, irDataLearned } from './domainSlice'
import { fetchButtonsFailure, fetchButtonsRequested, fetchButtonsSuccess } from './fetchStateSlice'
import { learnIrDataFailure, learnIrDataRequested, learnIrDataSuccess, pushButtonFailure, pushButtonRequested, pushButtonSuccess } from './requestStateSlice'
import { fetchButtonsStatusSelector } from './selector'

const addFetchButtonsListener = (startListening: AppStartListening): void => {
  startListening({
    actionCreator: fetchButtonsRequested,
    effect: async (action, listenerApi) => {
      const { remoteId } = action.payload
      if (remoteId === null) {
        return
      }
      const status = fetchButtonsStatusSelector(remoteId)(listenerApi.getState())

      if (status !== undefined) {
        const now = Date.now()
        // 前回のfetchから3分以内であればfetchしない
        if (status.isCached && (now - (status.lastUpdatedAt ?? 0) < 3 * 60000)) {
          return
        }
      }

      const result = await listenerApi.extra.api.fetchButtons({ remoteId })
      if (result.isError) {
        listenerApi.dispatch(fetchButtonsFailure({
          remoteId,
          error: result.error
        }))
        return
      }
      const now = Date.now()
      listenerApi.dispatch(fetchButtonsSuccess({ remoteId, updatedAt: now }))
      listenerApi.dispatch(buttonsFetched({
        buttons: result.data,
        remoteId
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
