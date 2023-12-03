export interface RequestStatus<E> {
  isPending: boolean
  isFailed: boolean
  error: E | undefined
}

export interface FetchStatus<E> {
  isFetching: boolean
  isFetchFailed: boolean
  isCached: boolean
  fetchError: E | undefined
}
