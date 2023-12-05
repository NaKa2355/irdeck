import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { addRemotesListener, remoteReducer } from '../ducks/remotes/'
import { addButtonsListener, buttonsReducer } from '../ducks/buttons'
import { addDevicesListener, devicesReducer } from '../ducks/devices'

import { listenerMiddleware } from './listenerMiddleware'
import { UiReducer } from '../ducks/ui'

const rootReducer = combineReducers({
  remotes: remoteReducer,
  buttons: buttonsReducer,
  devices: devicesReducer,
  ui: UiReducer
})

export type RootStore = ReturnType<typeof rootReducer>

const middlewareList = [listenerMiddleware.middleware]
export const store = configureStore({
  reducer: rootReducer,
  middleware: middlewareList
})

addRemotesListener(listenerMiddleware.startListening)
addButtonsListener(listenerMiddleware.startListening)
addDevicesListener(listenerMiddleware.startListening)
