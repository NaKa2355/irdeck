import { combineReducers } from 'redux'
import { snackBarReducer } from './snackBarSlice'
import { addRemoteModalReducer } from './addRemoteModal'
import { editRemoteModalReducer } from './editRemoteModal'
import { learnIrModalReducer } from './leanIrModal'

export {
  addRemoteModalClosed,
  addRemoteModalOpened
} from './addRemoteModal'

export {
  editRemoteModalClosed,
  editRemoteModalOpened
} from './editRemoteModal'

// slices
export {
  learnIrModalStateSelector,
  addRemoteModalStateSelector,
  editRemoteModalStateSelector
} from './selector'

// reducer
export const UiReducer = combineReducers({
  addRemoteModal: addRemoteModalReducer,
  editRemoteModal: editRemoteModalReducer,
  leanIrModal: learnIrModalReducer,
  snackBar: snackBarReducer
})
