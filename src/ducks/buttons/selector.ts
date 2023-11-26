import { type RootStore } from '../../store/store'
import { type Button } from '../../type/button'

export const selectButtons = (state: RootStore): Button[] => {
  return state.buttons.domianData.ids[state.remotes.appData.selectedRemoteId ?? ''].map((id) => {
    return state.buttons.domianData.byIds[id]
  })
}
