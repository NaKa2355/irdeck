import { useDispatch, useSelector } from 'react-redux'
import { selectRemoteState, selectRemotes, selectSelectedRemoteId } from '../ducks/remotes/selector'
import { fetchRemotes, postDeleteRemoteReq, postEditedRemote, postNewRemote, selectRemote } from '../ducks/remotes'
import { type AddRemoteReq, type DeleteRemoteReq, type EditRemoteReq } from '../interfaces/api'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useRemote = () => {
  const dispatch = useDispatch()
  const remotes = useSelector(selectRemotes)
  const selectedRemoteId = useSelector(selectSelectedRemoteId)
  const fetchState = useSelector(selectRemoteState)
  const state = {
    remotes,
    selectedRemoteId,
    ...fetchState
  }
  const fetch = (): void => {
    dispatch(fetchRemotes())
  }

  const select = (remoteId: string): void => {
    dispatch(selectRemote({ remoteId }))
  }

  const addRemote = (req: AddRemoteReq): void => {
    if (state.postNewRemoteStatus.isPosting) {
      return
    }
    dispatch(postNewRemote({
      ...req
    }))
  }

  const editRemote = (req: EditRemoteReq): void => {
    if (state.postEditedRemoteStatus.isPosting) {
      return
    }
    dispatch(postEditedRemote({
      ...req
    }))
  }

  const deleteRemote = (req: DeleteRemoteReq): void => {
    if (state.postDeletedRemoteStatus.isPosting) {
      return
    }
    dispatch(postDeleteRemoteReq({
      ...req
    }))
  }

  return [state, fetch, select, addRemote, editRemote, deleteRemote]
}
