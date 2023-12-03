import { type AppStartListening } from '../../app'
import { devicesFetched } from './domainSlice'
import { fetchDevices, fetchDevicesFailure, fetchDevicesSuccess } from './fechStateSlice'
import { irDataReceived } from './receivedIrDataSlice'
import { receiveIr, receiveIrFailure, receiveIrSuccess, sendIr, sendIrFailure, sendIrSuccess } from './requestStateSlice'

const addFetchDeviceListener = (startListening: AppStartListening): void => {
  startListening({
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
}

const addSendIrListener = (startListening: AppStartListening): void => {
  startListening({
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
}

const addReceiveIrListener = (startListening: AppStartListening): void => {
  startListening({
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
}

export const addDevicesListener = (startListening: AppStartListening): void => {
  addFetchDeviceListener(startListening)
  addReceiveIrListener(startListening)
  addSendIrListener(startListening)
}
