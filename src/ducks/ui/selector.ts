import { type RootStore } from '../../app'
import { type Remote } from '../../type/remote'
import { remoteSelector } from '../remotes'

export const addRemoteModalStateSelector = (state: RootStore): boolean => {
  const modalState = state.ui.addRemoteModal
  return modalState.isOpen
}

export const editRemoteModalStateSelector = (state: RootStore): { isOpen: boolean, editingRemote: Remote | null } => {
  const { isOpen, editingRemote } = state.ui.editRemoteModal
  return {
    isOpen,
    editingRemote: remoteSelector(state, editingRemote)
  }
}

export const learnIrModalStateSelector = (state: RootStore): boolean => {
  const modalState = state.ui.leanIrModal
  return modalState.isOpen
}
