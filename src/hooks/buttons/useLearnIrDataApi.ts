import { useState } from 'react'
import { type RequestStatus } from '../../utils/reqStatus'
import { type IApi, type ApiError, type LearnIrDataReq } from '../../interfaces/api'
import { Api } from '../../api/api'
import { url } from '../../constatnts'
import { type Result } from '../../type/result'
import { useDispatch } from 'react-redux'
import { irDataLearned } from '../../ducks/buttons'
import { learnIrModalClosed } from '../../ducks/ui/leanIrModal'

interface Dependencies {
  api: IApi
}

const defaultDep = {
  api: new Api(url)
}

export const useLearnIrDataApi = (deps: Dependencies = defaultDep):
[RequestStatus<ApiError>,
  {
    resetStatus: () => void
    learnIrData: (req: LearnIrDataReq) => Promise<Result<void, ApiError>>
  }] => {
  const [status, setStatus] = useState<RequestStatus<ApiError>>({
    status: 'idle',
    error: undefined
  })
  const dispatch = useDispatch()

  const learnIrData = async (req: LearnIrDataReq): Promise<Result<void, ApiError>> => {
    setStatus({
      status: 'pending',
      error: undefined
    })
    const result = await deps.api.learnIrData(req)
    if (!result.isError) {
      setStatus({
        status: 'success',
        error: undefined
      })
      dispatch(irDataLearned({
        buttonId: req.buttonId
      }))
      dispatch(learnIrModalClosed())
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
  return [status, { resetStatus, learnIrData }]
}
