import { listenerMiddleware } from '../../store/store'
import { remoteButtonsFetched } from '../remotes/domainSlice'
import { buttonsFetched, irDataLearned } from './domainSlice'
import { fetchButtons, fetchButtonsFailure, fetchButtonsSuccess } from './fetchStateSlice'
import { leanIrData, learnIrDataFailure, learnIrDataSuccess, pushButton, pushButtonFailure, pushButtonSuccess } from './requestStateSlice'

listenerMiddleware.startListening({
  actionCreator: fetchButtons,
  effect: async (action, api) => {
    const { remoteId } = action.payload
    const result = await api.extra.api.getButtons({
      remoteId
    })

    if (result.isError) {
      api.dispatch(fetchButtonsFailure({
        remoteId,
        error: result.error
      }))
      return
    }
    api.dispatch(fetchButtonsSuccess({
      remoteId
    }))
    api.dispatch(buttonsFetched({
      buttons: result.data
    }))
    api.dispatch(remoteButtonsFetched({
      remoteId,
      buttonIds: result.data.map(buttons => buttons.id)
    }))
  }
})

listenerMiddleware.startListening({
  actionCreator: pushButton,
  effect: async (action, api) => {
    const { buttonId } = action.payload
    const remoteId = api.getState().buttons.domain.byId[buttonId].remoteId
    const deviceId = api.getState().remotes.domain.byId[remoteId].deviceId
    const result = await api.extra.api.pushButton({
      remoteId,
      buttonId,
      deviceId
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
  actionCreator: leanIrData,
  effect: async (action, api) => {
    const { buttonId, irData } = action.payload
    const remoteId = api.getState().buttons.domain.byId[buttonId].remoteId

    const result = await api.extra.api.setIrData({
      remoteId,
      buttonId,
      irData
    })

    if (result.isError) {
      api.dispatch(learnIrDataFailure({
        buttonId,
        error: result.error
      }))
      return
    }

    api.dispatch(learnIrDataSuccess({
      buttonId
    }))
    api.dispatch(irDataLearned({
      buttonId
    }))
  }
})
