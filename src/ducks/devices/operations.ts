import { listenerMiddleware } from '../../store/store'
import { fetchDevices, fetchDevicesFailure, fetchDevicesSuccess, postIrData, postIrDataFailure, postIrDataSuccess, postReceiveIrReq, postReceiveIrReqFailure, postReceiveIrReqSuccess } from './slice'

listenerMiddleware.startListening({
  actionCreator: fetchDevices,
  effect: async (_, api) => {
    const result = await api.extra.api.getDevices()
    if (result.isError) {
      api.dispatch(fetchDevicesFailure({
        error: result.error
      }))
      return
    }
    api.dispatch(fetchDevicesSuccess({
      devices: result.data
    }))
  }
})

listenerMiddleware.startListening({
  actionCreator: postIrData,
  effect: async (action, api) => {
    const result = await api.extra.api.sendIr({
      irData: action.payload.irData,
      deviceId: action.payload.deviceId
    })
    if (result.isError) {
      api.dispatch(postIrDataFailure({
        deviceId: action.payload.deviceId,
        error: result.error
      }))
      return
    }
    api.dispatch(postIrDataSuccess({
      deviceId: action.payload.deviceId
    }))
  }
})

listenerMiddleware.startListening({
  actionCreator: postReceiveIrReq,
  effect: async (action, api) => {
    const result = await api.extra.api.receiveIr({
      deviceId: action.payload.deviceId
    })
    if (result.isError) {
      api.dispatch(postReceiveIrReqFailure({
        deviceId: action.payload.deviceId,
        error: result.error
      }))
      return
    }
    api.dispatch(postReceiveIrReqSuccess({
      deviceId: action.payload.deviceId,
      irData: result.data
    }))
  }
})
