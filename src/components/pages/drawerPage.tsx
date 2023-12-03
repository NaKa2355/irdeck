import { RemotesList } from '../organisms/lists/remotesList'
import DrawerTemplate from '../templates/drawerTemplate'
import { ButtonsGrid } from '../organisms/grids/buttonsGrid'
import { AddRemoteModal } from '../organisms/modals/addRemoteModal'

// atoms
import { EditRemoteModal } from '../organisms/modals/editRemoteModal'
import { type Remote } from '../../type/remote'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchRemote } from '../../ducks/remotes'

interface DrawerPageProps {
  selectedRemote?: Remote
  remotes?: Remote[]
  isFetchingRemote?: boolean
}

export function DrawerPage (props: DrawerPageProps): JSX.Element {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchRemote())
  }, [])
  return (
    <div>
      <DrawerTemplate
        title={props.selectedRemote?.name}
        drawer={
          <RemotesList />
        }
        contents={
          <div>
            {props.remotes?.length !== 0 &&
              <ButtonsGrid />
            }
            {(props.remotes?.length === 0 && !(props.isFetchingRemote ?? false)) &&
              <p>No Remotes</p>
            }
          </div>
        }
      />

      <AddRemoteModal />
      <EditRemoteModal />

      {/* <Snackbar open={snackBar.state.isOpen} onClose={snackBar.close} autoHideDuration={6000}>
        <Alert onClose={snackBar.close} severity={snackBar.state.severity} sx={{ width: '100%' }}>
          {snackBar.state.message}
        </Alert>
      </Snackbar> */}
    </div>
  )
};
