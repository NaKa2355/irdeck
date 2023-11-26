export interface PostStatus<E> {
  isPosting: boolean
  isPostFailed: boolean
  postError: E
}

export interface FetchStatus<E> {
  isFetching: boolean
  isFetchFailed: boolean
  isCached: boolean
  fetchError: E
}
