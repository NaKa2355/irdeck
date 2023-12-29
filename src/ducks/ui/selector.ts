import { createSelector } from '@reduxjs/toolkit'
import { type RootStore } from '../../app'

export const addRemoteModalStateSelector = createSelector(
  (state: RootStore) => state.ui.addRemoteModal,
  (modalState) => {
    return modalState.isOpen
  }
)

export const editRemoteModalStateSelector = createSelector(
  (state: RootStore) => state.ui.editRemoteModal,
  (state: RootStore) => state.remotes.domain.byId,
  (modalState, remotes) => {
    const { isOpen, editingRemote } = modalState
    return {
      isOpen,
      editingRemote: remotes[editingRemote]
    }
  }
)

export const learnIrModalStateSelector = createSelector(
  (state: RootStore) => state.ui.leanIrModal,
  (state: RootStore) => state.buttons.domain.byId,
  (state: RootStore) => state.remotes.domain.byId,
  (modalState, buttons, remotes) => {
    const buttonId = modalState.buttonId
    const remoteId = modalState.remoteId
    if (buttonId === null || remoteId === null) {
      return {
        isOpen: modalState.isOpen,
        button: null,
        remote: null
      }
    }
    return {
      isOpen: modalState.isOpen,
      button: buttons[buttonId],
      remote: remotes[remoteId]
    }
  }
)

export const snackbarSelector = createSelector(
  (state: RootStore) => state.ui.snackBar.snackBar,
  (snackbarState) => snackbarState
)

export const drawerSelector = createSelector(
  (state: RootStore) => state.ui.drawer,
  (drawerState) => drawerState.isOpen
)
