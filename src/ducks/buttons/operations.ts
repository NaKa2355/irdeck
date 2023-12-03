import { fetchButtons, fetchButtonsFailure, fetchButtonsSuccess, patchIrData, patchIrDataFailure, patchIrDataSuccess, pushButton, pushButtonFailure, pushButtonSuccess } from './slice'
import { listenerMiddleware } from '../../store/store'

listenerMiddleware.startListening({
  actionCreator: fetchButtons,
  effect: async (action, api) => {
    const result = await api.extra.api.getButtons({
      remoteId: action.payload.remoteId
    })

    if (result.isError) {
      api.dispatch(fetchButtonsFailure({
        remoteId: action.payload.remoteId,
        error: result.error
      }))
      return
    }
    api.dispatch(fetchButtonsSuccess({
      remoteId: action.payload.remoteId,
      buttons: result.data
    }))
  }
})

listenerMiddleware.startListening({
  actionCreator: pushButton,
  effect: async (action, api) => {
    const result = await api.extra.api.pushButton({
      remoteId: action.payload.remoteId,
      buttonId: action.payload.buttonId,
      deviceId: action.payload.deviceId
    })
    if (result.isError) {
      api.dispatch(pushButtonFailure({
        buttonId: action.payload.buttonId,
        error: result.error
      }))
      return
    }
    api.dispatch(pushButtonSuccess({
      buttonId: action.payload.buttonId
    }))
  }
})

listenerMiddleware.startListening({
  actionCreator: patchIrData,
  effect: async (action, api) => {
    const result = await api.extra.api.setIrData({
      remoteId: action.payload.remoteId,
      buttonId: action.payload.buttonId,
      irData: action.payload.irData
    })
    if (result.isError) {
      api.dispatch(patchIrDataFailure({
        buttonId: action.payload.buttonId,
        error: result.error
      }))
      return
    }
    api.dispatch(patchIrDataSuccess({
      buttonId: action.payload.buttonId
    }))
  }
})
