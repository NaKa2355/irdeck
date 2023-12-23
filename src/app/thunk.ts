import { withExtraArgument } from 'redux-thunk'
import { type ThunkDispatch, type ThunkAction } from 'redux-thunk'
import { type IApi } from '../interfaces/api'
import { url } from '../constatnts'
import { type RootStore } from '.'
import { Api } from '../api/api'

interface ThunkMiddlewareArg {
  api: IApi
}

export const reduxThunkMiddleware = withExtraArgument<RootStore, any, ThunkMiddlewareArg>({
  api: new Api(url)
})

export type ThunkSyncActionFunc = ThunkAction<void, RootStore, ThunkMiddlewareArg, any>
export type ThunkAsyncActionFunc = ThunkAction<Promise<void>, RootStore, ThunkMiddlewareArg, any>
export type AppDispatch = ThunkDispatch<RootStore, ThunkMiddlewareArg, any>
