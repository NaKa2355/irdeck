import { type AppStartListening } from '../../app'
import { devicesFetched } from './domainSlice'
import { fetchDevicesFailure, fetchDevicesRequested, fetchDevicesSuccess } from './fechStateSlice'
import { irDataReceived } from './receivedIrDataSlice'
import { receiveIrFailure, receiveIrRequested, receiveIrSuccess, sendIrDataFailure, sendIrDataRequested, sendIrDataSuccess } from './requestStateSlice'
import { receivedIrDataSelector } from './selector'

const addFetchDevicesListener = (startListening: AppStartListening): void => {
  startListening({
    actionCreator: fetchDevicesRequested,
    effect: async (_, listenerApi) => {
      const result = await listenerApi.extra.api.fetchDevices()
      if (result.isError) {
        listenerApi.dispatch(fetchDevicesFailure({
          error: result.error
        }))
        return
      }
      listenerApi.dispatch(fetchDevicesSuccess())
      listenerApi.dispatch(devicesFetched({
        devices: result.data
      }))
    }
  })
}

const addReceiveIrListener = (startListening: AppStartListening): void => {
  startListening({
    actionCreator: receiveIrRequested,
    effect: async (action, listenerApi) => {
      const { deviceId } = action.payload
      const result = await listenerApi.extra.api.receiveIr({ deviceId })
      if (result.isError) {
        listenerApi.dispatch(receiveIrFailure({
          deviceId,
          error: result.error
        }))
        return
      }
      listenerApi.dispatch(receiveIrSuccess({ deviceId }))
      listenerApi.dispatch(irDataReceived({
        deviceId,
        irData: result.data
      }))
    }
  })
}

const addSendIrListener = (startListening: AppStartListening): void => {
  startListening({
    actionCreator: sendIrDataRequested,
    effect: async (action, listenerApi) => {
      const { deviceId } = action.payload
      const irData = receivedIrDataSelector(deviceId)(listenerApi.getState())
      const result = await listenerApi.extra.api.sendIr({ deviceId, irData })
      if (result.isError) {
        listenerApi.dispatch(sendIrDataFailure({
          deviceId,
          error: result.error
        }))
        return
      }
      listenerApi.dispatch(sendIrDataSuccess({ deviceId }))
    }
  })
}

export const addDeviceListener = (startListening: AppStartListening): void => {
  addFetchDevicesListener(startListening)
  addReceiveIrListener(startListening)
  addSendIrListener(startListening)
}
