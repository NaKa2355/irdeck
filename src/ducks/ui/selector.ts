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
      editingRemote: remoteSelector(editingRemote)(state)
    }
  }
)

export const learnIrModalStateSelector = createSelector(
  selectSelf,
  (state) => {
    const buttonId = state.ui.leanIrModal.buttonId
    const remoteId = state.ui.leanIrModal.remoteId
    if (buttonId === null || remoteId === null) {
      return {
        isOpen: state.ui.leanIrModal.isOpen,
        button: null,
        remote: null
      }
    }
    return {
      isOpen: state.ui.leanIrModal.isOpen,
      button: state.buttons.domain.byId[buttonId],
      remote: state.remotes.domain.byId[remoteId]
    }
  }
)

export const snackbarSelector = createSelector(
  selectSelf,
  (state) => {
    return state.ui.snackBar.snackBar
  }
)

export const drawerSelector = createSelector(
  selectSelf,
  (state) => {
    return state.ui.drawer.isOpen
  }
)
