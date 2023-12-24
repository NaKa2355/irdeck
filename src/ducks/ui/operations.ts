import { isAnyOf } from '@reduxjs/toolkit'
import { type AppStartListening } from '../../app'
import { deleteRemoteSuccess, patchRemoteSuccess, postRemoteSuccess } from '../remotes/requestStateSlice'
import { addRemoteModalClosed } from './addRemoteModalSlice'
import { editRemoteModalClosed } from './editRemoteModalSlice'
import { learnIrDataSuccess } from '../buttons/requestStateSlice'
import { learnIrModalClosed } from './leanIrModal'

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

const addLearnIrModalCliseListener = (starListening: AppStartListening): void => {
  starListening({
    actionCreator: learnIrDataSuccess,
    effect: (_, listenerApi) => {
      listenerApi.dispatch(learnIrModalClosed())
    }
  })
}

export const addUiListener = (startListening: AppStartListening): void => {
  addAddRemoteModalCloseListener(startListening)
  addEditRemoteModalCloseListener(startListening)
  addLearnIrModalCliseListener(startListening)
}
