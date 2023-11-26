import { combineReducers, configureStore, createListenerMiddleware } from '@reduxjs/toolkit'
import { type IApi } from '../interfaces/api'

import { Api } from '../api/api'

import { url } from '../constatnts'
import { remoteReducer } from '../ducks/remotes'
import { buttonsReducer } from '../ducks/buttons'
import { devicesReducer } from '../ducks/devices'

const rootReducer = combineReducers({
  remotes: remoteReducer,
  buttons: buttonsReducer,
  devices: devicesReducer
})

export const store = configureStore({
  reducer: rootReducer
})

interface ListenerMiddlewareArg {
  api: IApi
}

export type RootStore = ReturnType<typeof rootReducer>

export const listenerMiddleware = createListenerMiddleware<RootStore, any, ListenerMiddlewareArg>({
  extra: {
    api: new Api(url)
  }
})
