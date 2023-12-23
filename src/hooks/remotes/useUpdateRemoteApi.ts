import { useState } from 'react'
import { type RequestStatus } from '../../utils/reqStatus'
import { type IApi, type ApiError, type UpdateRemoteReq } from '../../interfaces/api'
import { Api } from '../../api/api'
import { url } from '../../constatnts'
import { type Result } from '../../type/result'
import { useDispatch } from 'react-redux'
import { editRemoteModalClosed, snackBarShown } from '../../ducks/ui'
import { remoteDeleted, remoteEdited } from '../../ducks/remotes'

interface Dependencies {
  api: IApi
}

const defaultDep = {
  api: new Api(url)
}

export const useUpdateRemoteApi = (deps: Dependencies = defaultDep):
[RequestStatus<ApiError>,
  {
    resetStatus: () => void
    updateRemote: (req: UpdateRemoteReq) => Promise<Result<void, ApiError>>
  }] => {
  const [status, setStatus] = useState<RequestStatus<ApiError>>({
    status: 'idle',
    error: undefined
  })
  const dispatch = useDispatch()

  const updateRemote = async (req: UpdateRemoteReq): Promise<Result<void, ApiError>> => {
    setStatus({
      status: 'pending',
      error: undefined
    })
    const result = await deps.api.updateRemotes(req)
    if (!result.isError) {
      setStatus({
        status: 'success',
        error: undefined
      })
      dispatch(remoteEdited({
        remoteId: req.remoteId,
        remoteName: req.remoteName,
        deviceId: req.deviceId
      }))
      dispatch(editRemoteModalClosed())
      return {
        isError: false,
        data: undefined
      }
    }
    setStatus({
      status: 'failed',
      error: result.error
    })

    if (result.error.code === 'remote_not_found') {
      dispatch(remoteDeleted({
        deletedRemoteId: req.remoteId
      }))
      dispatch(editRemoteModalClosed())
      dispatch(snackBarShown({
        severity: 'error',
        message: 'error.remote_not_found'
      }))
    }
    return result
  }

  const resetStatus = (): void => {
    setStatus({
      status: 'idle',
      error: undefined
    })
  }
  return [status, { resetStatus, updateRemote }]
}
