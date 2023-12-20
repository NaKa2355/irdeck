import { type ThunkActionFunc } from '../../app'
import { devicesFetched } from './domainSlice'
import { fetchDevicesFailure, fetchDevicesRequested, fetchDevicesSuccess } from './fechStateSlice'
import { irDataReceived } from './receivedIrDataSlice'
import { receiveIrFailure, receiveIrRequested, receiveIrSuccess, tryIrDataFailure, tryIrDataRequested, tryIrDataSuccess } from './requestStateSlice'
import { receivedIrDataSelector } from './selector'

export const fetchDevices = (): ThunkActionFunc => {
  return async (dispatch, _, extra) => {
    dispatch(fetchDevicesRequested())
    const result = await extra.api.getDevices()
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

export const tryIrData = (payload: { deviceId: string }): ThunkActionFunc => {
  return async (dispatch, getstate, extra) => {
    const irData = receivedIrDataSelector(getstate())
    dispatch(tryIrDataRequested())
    const result = await extra.api.sendIr({
      irData,
      deviceId: payload.deviceId
    })
    if (result.isError) {
      dispatch(tryIrDataFailure({
        error: result.error
      }))
      return
    }

    dispatch(tryIrDataSuccess())
  }
}

export const receiveIr = (payload: { deviceId: string }): ThunkActionFunc => {
  return async (dispatch, _, extra) => {
    dispatch(receiveIrRequested())
    const result = await extra.api.receiveIr({
      deviceId: payload.deviceId
    })
    if (result.isError) {
      dispatch(receiveIrFailure({
        error: result.error
      }))
      return
    }
    dispatch(receiveIrSuccess())
    dispatch(irDataReceived({
      irData: result.data
    }))
  }
}
