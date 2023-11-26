export type Result<D, E> = {
  isError: false
  data: D
} | {
  isError: true
  error: E
}
