export interface RequestStatus<E> {
  status: 'idle' | 'pending' | 'success' | 'failed'
  error: E | undefined
}

export interface FetchStatus<E> {
  isFetching: boolean
  isFetchFailed: boolean
  isCached: boolean
  fetchError: E | undefined
}
