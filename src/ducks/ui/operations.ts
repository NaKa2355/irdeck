import { type ThunkActionFunc } from '../../app'
import { type CreateRemoteReq } from '../../interfaces/api'
import { postRemoteStatusSelector } from '../remotes'
import { postRemote } from '../remotes/operations'
import { addRemoteModalClosed } from './addRemoteModal'

export const postRemoteWithErrorHandling = (req: CreateRemoteReq): ThunkActionFunc => {
  return async (dispatch, getState) => {
    await dispatch(postRemote(req))
    const status = postRemoteStatusSelector(getState())
    if (status.status === 'success') {
      dispatch(addRemoteModalClosed())
    }
  }
}
