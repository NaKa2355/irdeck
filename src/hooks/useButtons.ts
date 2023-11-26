import { useDispatch, useSelector } from 'react-redux'
import { selectButtons, selectButtonsState } from '../ducks/buttons/selector'
import { postPushButtonReq, postSettingIrData } from '../ducks/buttons'
import { type IrData } from '../type/irdata.type'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useButtons = () => {
  const dispatch = useDispatch()
  const buttons = useSelector(selectButtons)
  const buttonsState = useSelector(selectButtonsState)
  const state = {
    buttons,
    ...buttonsState
  }

  const pushButton = (remoteId: string, buttonId: string, deviceId: string): void => {
    if (state.postingStatus[buttonId]?.pushButton?.isPosting ?? false) {
      return
    }
    dispatch(postPushButtonReq({
      remoteId,
      buttonId,
      deviceId
    }))
  }

  const setIrData = (remoteId: string, buttonId: string, irData: IrData): void => {
    if (state.postingStatus[buttonId]?.settingIrData?.isPosting ?? false) {
      return
    }
    dispatch(postSettingIrData({
      remoteId,
      buttonId,
      irData
    }))
  }
  return [state, pushButton, setIrData]
}
