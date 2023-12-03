import { type RootStore } from '../../app/store'
import { type Button } from '../../type/button'
import { selectedRemoteSelector } from '../remotes/selector'

export const buttonsSelector = (state: RootStore): (Button[] | undefined) => {
  const selectedRemote = selectedRemoteSelector(state)
  if (selectedRemote === null) {
    return undefined
  }
  const buttonIds = state.remotes.domain.byId[selectedRemote].buttonIds
  return buttonIds.map((id) => state.buttons.domain.byId[id])
}
