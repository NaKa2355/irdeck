import { createSelector } from '@reduxjs/toolkit'
import { type RootStore } from '../../app'
import { remoteSelector } from '../remotes'

const selectSelf = (state: RootStore): RootStore => state

export const addRemoteModalStateSelector = createSelector(
  selectSelf,
  (state) => {
    const modalState = state.ui.addRemoteModal
    return modalState.isOpen
  }
)

export const editRemoteModalStateSelector = createSelector(
  selectSelf,
  (state) => {
    const { isOpen, editingRemote } = state.ui.editRemoteModal
    return {
      isOpen,
      editingRemote: remoteSelector(state, editingRemote)
    }
  }
)

export const learnIrModalStateSelector = createSelector(
  selectSelf,
  (state) => {
    const modalState = state.ui.leanIrModal
    return modalState.isOpen
  }
)

export const snackbarSelector = createSelector(
  selectSelf,
  (state) => {
    return state.ui.snackBar.snackBar
  }
)
