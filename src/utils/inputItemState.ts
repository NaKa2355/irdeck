export type InputItemState<S, E> = {
  isInVaild: false
  state: S
} | {
  isInvaild: true
  state: S
  errorMessage: E
}
