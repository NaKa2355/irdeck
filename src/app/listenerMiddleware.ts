import { type TypedStartListening, createListenerMiddleware } from '@reduxjs/toolkit'
import { type RootStore } from './store'
import { type IApi } from '../interfaces/api'
import { url } from '../constatnts'
import { Api } from '../api/api'

interface ListenerMiddlewareArg {
  api: IApi
}

export const listenerMiddleware = createListenerMiddleware<RootStore, any, ListenerMiddlewareArg>({
  extra: {
    api: new Api(url)
  }
})

export type AppStartListening = TypedStartListening<RootStore, any, ListenerMiddlewareArg>
