export type InputItemState<S, E> = {
  isInvaild: false
  state: S
} | {
  isInvaild: true
  state: S
  errorMessage: E
}
