import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { remoteReducer } from '../ducks/remotes/'
import { buttonsReducer } from '../ducks/buttons'
import { devicesReducer } from '../ducks/devices'
import { UiReducer } from '../ducks/ui'
import { reduxThunkMiddleware } from './thunk'

const rootReducer = combineReducers({
  remotes: remoteReducer,
  buttons: buttonsReducer,
  devices: devicesReducer,
  ui: UiReducer
})

export type RootStore = ReturnType<typeof rootReducer>

export const store = configureStore({
  reducer: rootReducer,
  middleware: [reduxThunkMiddleware]
})
