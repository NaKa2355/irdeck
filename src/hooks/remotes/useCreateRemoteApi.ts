import { useState } from 'react'
import { type RequestStatus } from '../../utils/reqStatus'
import { type IApi, type ApiError, type CreateRemoteReq } from '../../interfaces/api'
import { Api } from '../../api/api'
import { url } from '../../constatnts'
import { type Result } from '../../type/result'
import { useDispatch } from 'react-redux'
import { remoteAdded } from '../../ducks/remotes/domainSlice'
import { remoteSelected } from '../../ducks/remotes'
import { addRemoteModalClosed } from '../../ducks/ui'

interface Dependencies {
  api: IApi
}

const defaultDep = {
  api: new Api(url)
}

export const useCreateRemoteApi = (deps: Dependencies = defaultDep):
[RequestStatus<ApiError>,
  {
    resetStatus: () => void
    createRemote: (req: CreateRemoteReq) => Promise<Result<void, ApiError>>
  }] => {
  const [status, setStatus] = useState<RequestStatus<ApiError>>({
    status: 'idle',
    error: undefined
  })
  const dispatch = useDispatch()

  const createRemote = async (req: CreateRemoteReq): Promise<Result<void, ApiError>> => {
    setStatus({
      status: 'pending',
      error: undefined
    })
    const result = await deps.api.createRemote(req)
    if (!result.isError) {
      const addedRemote = result.data
      setStatus({
        status: 'success',
        error: undefined
      })
      dispatch(remoteAdded({
        remoteId: addedRemote.id,
        remoteName: addedRemote.name,
        tag: addedRemote.tag,
        deviceId: addedRemote.deviceId
      }))
      dispatch(remoteSelected({
        remoteId: addedRemote.id
      }))
      dispatch(addRemoteModalClosed())
      return {
        isError: false,
        data: undefined
      }
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
  return [status, { resetStatus, createRemote }]
}
