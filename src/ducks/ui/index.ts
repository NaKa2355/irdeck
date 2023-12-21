import { combineReducers } from 'redux'
import { snackBarReducer } from './snackBarSlice'
import { addRemoteModalReducer } from './addRemoteModal'
import { editRemoteModalReducer } from './editRemoteModal'
import { learnIrModalReducer } from './leanIrModal'

// actions
export {
  addRemoteModalClosed,
  addRemoteModalOpened
} from './addRemoteModal'
export {
  editRemoteModalClosed,
  editRemoteModalOpened
} from './editRemoteModal'
export {
  snackBarHidden,
  snackBarShown
} from './snackBarSlice'

// selectors
export {
  learnIrModalStateSelector,
  addRemoteModalStateSelector,
  editRemoteModalStateSelector,
  snackbarSelector
} from './selector'

// reducer
export const UiReducer = combineReducers({
  addRemoteModal: addRemoteModalReducer,
  editRemoteModal: editRemoteModalReducer,
  leanIrModal: learnIrModalReducer,
  snackBar: snackBarReducer
})
