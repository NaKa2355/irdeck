import { useDispatch, useSelector } from 'react-redux'
import { selectDevicesCanReceive, selectDevicesCanSend, selectDevicesState } from '../ducks/devices/selector'
import { fetchDevices, postIrData, postReceiveIrReq } from '../ducks/devices'
import { type IrData } from '../type/irdata.type'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useDevices = () => {
  const dispatch = useDispatch()
  const devicesCanSend = useSelector(selectDevicesCanSend)
  const devicesCanReceive = useSelector(selectDevicesCanReceive)
  const devicesState = useSelector(selectDevicesState)

  const state = {
    devicesCanReceive,
    devicesCanSend,
    ...devicesState
  }

  const fetch = (): void => {
    dispatch(fetchDevices())
  }

  const sendIr = (deviceId: string, irData: IrData): void => {
    if (state.postIrDataStatus[deviceId]?.isPosting ?? false) {
      return
    }
    dispatch(postIrData({
      deviceId,
      irData
    }))
  }

  const receiveIr = (deviceId: string, irData: IrData): void => {
    if (state.postReceiveIrStatus[deviceId]?.isPosting ?? false) {
      return
    }
    dispatch(postReceiveIrReq({
      deviceId
    }))
  }

  return [state, fetch, sendIr, receiveIr]
}
