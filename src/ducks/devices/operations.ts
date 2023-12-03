import { listenerMiddleware } from '../../store/store'
import { fetchDevices, fetchDevicesFailure, fetchDevicesSuccess, receiveIr, receiveIrFailure, receiveSuccess, sendIr, sendIrFailure, sendIrSuccess } from './slice'

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
  actionCreator: sendIr,
  effect: async (action, api) => {
    const result = await api.extra.api.sendIr({
      irData: action.payload.irData,
      deviceId: action.payload.deviceId
    })
    if (result.isError) {
      api.dispatch(sendIrFailure({
        deviceId: action.payload.deviceId,
        error: result.error
      }))
      return
    }
    api.dispatch(sendIrSuccess({
      deviceId: action.payload.deviceId
    }))
  }
})

listenerMiddleware.startListening({
  actionCreator: receiveIr,
  effect: async (action, api) => {
    const result = await api.extra.api.receiveIr({
      deviceId: action.payload.deviceId
    })
    if (result.isError) {
      api.dispatch(receiveIrFailure({
        deviceId: action.payload.deviceId,
        error: result.error
      }))
      return
    }
    api.dispatch(receiveSuccess({
      deviceId: action.payload.deviceId,
      irData: result.data
    }))
  }
})
