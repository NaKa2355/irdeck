import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { remoteReducer } from '../ducks/remotes/'
import { buttonsReducer } from '../ducks/buttons'
import { devicesReducer } from '../ducks/devices'
import { UiReducer } from '../ducks/ui'
import { reduxThunkMiddleware } from './thunk'
import { listenerMiddleware } from './listener'
import { addButtonsListener } from '../ducks/buttons/operations'
import { addRemoteListener } from '../ducks/remotes/operations'
import { addDeviceListener } from '../ducks/devices/operations'
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
