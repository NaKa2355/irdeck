import { useState } from 'react'
import { type RequestStatus } from '../../utils/reqStatus'
import { type IApi, type ApiError, type DeleteRemoteReq } from '../../interfaces/api'
import { Api } from '../../api/api'
import { url } from '../../constatnts'
import { type Result } from '../../type/result'
import { useDispatch, useSelector } from 'react-redux'
import { remoteSelected, remotesSelector, selectedRemoteSelector, remoteDeleted } from '../../ducks/remotes'
import { editRemoteModalClosed } from '../../ducks/ui'

interface Dependencies {
  api: IApi
}

const defaultDep = {
  api: new Api(url)
}

export const useDeleteRemoteApi = (deps: Dependencies = defaultDep):
[RequestStatus<ApiError>,
  {
    resetStatus: () => void
    deleteRemote: (req: DeleteRemoteReq) => Promise<Result<void, ApiError>>
  }] => {
  const [status, setStatus] = useState<RequestStatus<ApiError>>({
    status: 'idle',
    error: undefined
  })
  const dispatch = useDispatch()
  const selectedRemote = useSelector(selectedRemoteSelector)
  const remotes = useSelector(remotesSelector)

  const deleteRemote = async (req: DeleteRemoteReq): Promise<Result<void, ApiError>> => {
    setStatus({
      status: 'pending',
      error: undefined
    })
    const result = await deps.api.deleteRemotes(req)
    if (!result.isError) {
      setStatus({
        status: 'success',
        error: undefined
      })

      if (req.remoteId === selectedRemote?.id) {
        dispatch(remoteSelected({
          remoteId: remotes.at(0)?.id ?? null
        }))
      }
      dispatch(remoteDeleted({
        deletedRemoteId: req.remoteId
      }))
      dispatch(editRemoteModalClosed())
      return {
        isError: false,
        data: undefined
      }
    }

    if (result.error.code === 'remote_not_found') {
      dispatch(remoteDeleted({
        deletedRemoteId: req.remoteId
      }))
      dispatch(editRemoteModalClosed())
    }

    setStatus({
      status: 'failed',
      error: result.error
    })
    return result
  }

  const resetStatus = (): void => {
    setStatus({
      status: 'idle',
      error: undefined
    })
  }
  return [status, { resetStatus, deleteRemote }]
}
