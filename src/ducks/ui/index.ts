import { combineReducers } from 'redux'
import { snackBarReducer } from './snackBarSlice'
import { addRemoteModalReducer } from './addRemoteModalSlice'
import { editRemoteModalReducer } from './editRemoteModalSlice'
import { learnIrModalReducer } from './leanIrModal'
import { drawerReducer } from './drawerSlice'

// actions
export {
  addRemoteModalClosed,
  addRemoteModalOpened
} from './addRemoteModalSlice'
export {
  editRemoteModalClosed,
  editRemoteModalOpened
} from './editRemoteModalSlice'
export {
  snackBarHidden,
  snackBarShown
} from './snackBarSlice'
export {
  drawerClosed,
  drawerOpened
} from './drawerSlice'

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
  snackBar: snackBarReducer,
  drawer: drawerReducer
})
