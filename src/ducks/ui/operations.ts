import { isAnyOf } from '@reduxjs/toolkit'
import { type AppStartListening } from '../../app'
import { deleteRemoteSuccess, patchRemoteSuccess, postRemoteSuccess } from '../remotes/requestStateSlice'
import { addRemoteModalClosed } from './addRemoteModalSlice'
import { editRemoteModalClosed } from './editRemoteModalSlice'
import { learnIrDataSuccess, pushButtonFailure } from '../buttons/requestStateSlice'
import { learnIrModalClosed } from './leanIrModal'
import { snackBarShown } from './snackBarSlice'

const addAddRemoteModalCloseListener = (startListening: AppStartListening): void => {
  startListening({
    actionCreator: postRemoteSuccess,
    effect: async (_, listenerApi) => {
      listenerApi.dispatch(addRemoteModalClosed())
    }
  })
}

const addEditRemoteModalCloseListener = (startListening: AppStartListening): void => {
  startListening({
    matcher: isAnyOf(deleteRemoteSuccess, patchRemoteSuccess),
    effect: (_, listenerApi) => {
      listenerApi.dispatch(editRemoteModalClosed())
    }
  })
}

const addLearnIrModalCloseListener = (starListening: AppStartListening): void => {
  starListening({
    actionCreator: learnIrDataSuccess,
    effect: (_, listenerApi) => {
      listenerApi.dispatch(learnIrModalClosed())
    }
  })
}

const addPushButtonFailureListener = (startListening: AppStartListening): void => {
  startListening({
    actionCreator: pushButtonFailure,
    effect: (_, listenerApi) => {
      listenerApi.dispatch(snackBarShown({
        message: 'error.request',
        severity: 'error'
      }))
    }
  })
}

export const addUiListener = (startListening: AppStartListening): void => {
  addAddRemoteModalCloseListener(startListening)
  addEditRemoteModalCloseListener(startListening)
  addLearnIrModalCloseListener(startListening)
  addPushButtonFailureListener(startListening)
}
