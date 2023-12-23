import { type ThunkAsyncActionFunc } from '../../app'
import { remoteButtonsFetched } from '../remotes/domainSlice'
import { buttonsFetched } from './domainSlice'
import { fetchButtonsFailure, fetchButtonsRequested, fetchButtonsSuccess } from './fetchStateSlice'
import { pushButtonFailure, pushButtonRequested, pushButtonSuccess } from './requestStateSlice'

export const fetchButtons = (payload: { remoteId: string }): ThunkAsyncActionFunc => {
  return async (dispatch, _, extra) => {
    const { remoteId } = payload
    dispatch(fetchButtonsRequested({
      remoteId
    }))
    const result = await extra.api.fetchButtons({
      remoteId
    })

    if (result.isError) {
      dispatch(fetchButtonsFailure({
        remoteId,
        error: result.error
      }))
      return
    }
    dispatch(fetchButtonsSuccess({
      remoteId
    }))
    dispatch(buttonsFetched({
      buttons: result.data
    }))
    dispatch(remoteButtonsFetched({
      remoteId,
      buttonIds: result.data.map(buttons => buttons.id)
    }))
  }
}

export const pushButton = (payload: { buttonId: string }): ThunkAsyncActionFunc => {
  return async (dispatch, getState, extra) => {
    const { buttonId } = payload
    const remoteId = getState().buttons.domain.byId[buttonId].remoteId
    const deviceId = getState().remotes.domain.byId[remoteId].deviceId
    dispatch(pushButtonRequested({
      buttonId
    }))
    const result = await extra.api.pushButton({
      remoteId,
      buttonId,
      deviceId
    })

    if (result.isError) {
      dispatch(pushButtonFailure({
        buttonId,
        error: result.error
      }))
      return
    }

    dispatch(pushButtonSuccess({
      buttonId
    }))
  }
}
