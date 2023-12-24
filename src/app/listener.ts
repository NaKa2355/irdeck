import { createListenerMiddleware } from '@reduxjs/toolkit'
import { type IApi } from '../interfaces/api'
import { type RootStore } from './store'
import { Api } from '../api/api'
import { url } from '../constatnts'

interface ThunkMiddlewareArg {
  api: IApi
}

export const listenerMiddleware = createListenerMiddleware<RootStore, any, ThunkMiddlewareArg>({
  extra: {
    api: new Api(url)
  }
})

export type AppStartListening = typeof listenerMiddleware.startListening
