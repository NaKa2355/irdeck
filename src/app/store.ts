import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { addRemoteListener, remoteReducer } from '../ducks/remotes/'
import { addButtonsListener, buttonsReducer } from '../ducks/buttons'
import { addDeviceListener, devicesReducer } from '../ducks/devices'
import { UiReducer, addUiListener } from '../ducks/ui'
import { reduxThunkMiddleware } from './thunk'
import { listenerMiddleware } from './listener'
import { addLogicalListener } from '../ducks/logic/operations'

const rootReducer = combineReducers({
  remotes: remoteReducer,
  buttons: buttonsReducer,
  devices: devicesReducer,
  ui: UiReducer
})

export type RootStore = ReturnType<typeof rootReducer>

export const store = configureStore({
  reducer: rootReducer,
  middleware: [reduxThunkMiddleware, listenerMiddleware.middleware]
})

addRemoteListener(listenerMiddleware.startListening)
addButtonsListener(listenerMiddleware.startListening)
addDeviceListener(listenerMiddleware.startListening)
addLogicalListener(listenerMiddleware.startListening)
addUiListener(listenerMiddleware.startListening)
