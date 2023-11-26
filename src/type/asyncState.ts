export interface AsyncCacheState<T, E> {
  isError: boolean
  contents: T
  isLoading: boolean
  isCached: boolean
  error: E | undefined
}
