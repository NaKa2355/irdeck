import { listenerMiddleware } from '../../store/store'
import { devicesFetched } from './domainSlice'
import { fetchDevices, fetchDevicesFailure, fetchDevicesSuccess } from './fechStateSlice'
import { irDataReceived } from './receivedIrDataSlice'
import { receiveIr, receiveIrFailure, receiveIrSuccess, sendIr, sendIrFailure, sendIrSuccess } from './requestStateSlice'

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
    api.dispatch(fetchDevicesSuccess())
    api.dispatch(devicesFetched({
      devices: result.data
    }))
  }
})

listenerMiddleware.startListening({
  actionCreator: sendIr,
  effect: async (action, api) => {
    const { deviceId, irData } = action.payload
    const result = await api.extra.api.sendIr({
      irData,
      deviceId
    })
    if (result.isError) {
      api.dispatch(sendIrFailure({
        error: result.error
      }))
      return
    }
    api.dispatch(sendIrSuccess())
  }
})

listenerMiddleware.startListening({
  actionCreator: receiveIr,
  effect: async (action, api) => {
    const { deviceId } = action.payload
    const result = await api.extra.api.receiveIr({
      deviceId
    })
    if (result.isError) {
      api.dispatch(receiveIrFailure({
        error: result.error
      }))
      return
    }
    api.dispatch(receiveIrSuccess())
    api.dispatch(irDataReceived({
      irData: result.data
    }))
  }
})
