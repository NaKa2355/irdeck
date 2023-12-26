import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { addRemoteListener, remoteReducer } from '../ducks/remotes/'
import { addButtonsListener, buttonsReducer } from '../ducks/buttons'
import { addDeviceListener, devicesReducer, fetchDevicesRequested } from '../ducks/devices'
import { UiReducer, addUiListener } from '../ducks/ui'
import { listenerMiddleware } from './listener'
import { addLogicalListener } from '../ducks/logic/operations'
import { fetchRemoteRequested } from '../ducks/remotes/fetchStateSlice'

const rootReducer = combineReducers({
  remotes: remoteReducer,
  buttons: buttonsReducer,
  devices: devicesReducer,
  ui: UiReducer
})

export type RootStore = ReturnType<typeof rootReducer>

export const store = configureStore({
  reducer: rootReducer,
  middleware: [listenerMiddleware.middleware]
})

addRemoteListener(listenerMiddleware.startListening)
addButtonsListener(listenerMiddleware.startListening)
addDeviceListener(listenerMiddleware.startListening)
addLogicalListener(listenerMiddleware.startListening)
addUiListener(listenerMiddleware.startListening)

store.dispatch(fetchRemoteRequested())
setInterval(() => {
  store.dispatch(fetchRemoteRequested())
}, 10 * 1000)
store.dispatch(fetchDevicesRequested())
