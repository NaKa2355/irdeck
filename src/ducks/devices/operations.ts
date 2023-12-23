import { type ThunkAsyncActionFunc } from '../../app'
import { devicesFetched } from './domainSlice'
import { fetchDevicesFailure, fetchDevicesRequested, fetchDevicesSuccess } from './fechStateSlice'
import { irDataReceived } from './receivedIrDataSlice'
import { receiveIrFailure, receiveIrRequested, receiveIrSuccess } from './requestStateSlice'

export const fetchDevices = (): ThunkAsyncActionFunc => {
  return async (dispatch, _, extra) => {
    dispatch(fetchDevicesRequested())
    const result = await extra.api.fetchDevices()
    if (result.isError) {
      dispatch(fetchDevicesFailure({
        error: result.error
      }))
      return
    }

    dispatch(fetchDevicesSuccess())
    dispatch(devicesFetched({
      devices: result.data
    }))
  }
}

export const receiveIr = (payload: { deviceId: string }): ThunkAsyncActionFunc => {
  return async (dispatch, _, extra) => {
    const { deviceId } = payload
    dispatch(receiveIrRequested({ deviceId }))
    const result = await extra.api.receiveIr({
      deviceId
    })
    if (result.isError) {
      dispatch(receiveIrFailure({
        deviceId,
        error: result.error
      }))
      return
    }
    dispatch(receiveIrSuccess({ deviceId }))
    dispatch(irDataReceived({
      deviceId,
      irData: result.data
    }))
  }
}
