import { fetchButtons, fetchButtonsFailure, fetchButtonsSuccess, postPushButtonReq, postPushButtonSuccess, postPushButtonFailure, postSettingIrData, postSettingIrDataFailure, postSettingIrDataSuccess } from './slice'
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
  actionCreator: postPushButtonReq,
  effect: async (action, api) => {
    const result = await api.extra.api.pushButton({
      remoteId: action.payload.remoteId,
      buttonId: action.payload.buttonId,
      deviceId: action.payload.deviceId
    })
    if (result.isError) {
      api.dispatch(postPushButtonFailure({
        buttonId: action.payload.buttonId,
        error: result.error
      }))
      return
    }
    api.dispatch(postPushButtonSuccess({
      buttonId: action.payload.buttonId
    }))
  }
})

listenerMiddleware.startListening({
  actionCreator: postSettingIrData,
  effect: async (action, api) => {
    const result = await api.extra.api.setIrData({
      remoteId: action.payload.remoteId,
      buttonId: action.payload.buttonId,
      irData: action.payload.irData
    })
    if (result.isError) {
      api.dispatch(postSettingIrDataFailure({
        buttonId: action.payload.buttonId,
        error: result.error
      }))
      return
    }
    api.dispatch(postSettingIrDataSuccess({
      buttonId: action.payload.buttonId
    }))
  }
})
