import { RemotesList } from '../organisms/remotesList'
import DrawerTemplate from '../templates/drawerTemplate'
import { ButtonsGrid } from '../organisms/buttonsGrid'
import { AddRemoteModal } from '../organisms/addRemoteModal'

// atoms
import { EditRemoteModal } from '../organisms/modals/editRemoteModal'
import { type Remote } from '../../type/remote'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchRemotes, selectedRemoteSelector } from '../../ducks/remotes'
import { fetchDevices } from '../../ducks/devices'
import { type AppDispatch } from '../../app/thunk'
import { fetchButtons } from '../../ducks/buttons'

interface DrawerPageProps {
  selectedRemote?: Remote
  remotes?: Remote[]
  isFetchingRemote?: boolean
}

export const DrawerPage = (props: DrawerPageProps): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>()
  const selectedRemote = useSelector(selectedRemoteSelector)
  useEffect(() => {
    void dispatch(fetchRemotes())
    void dispatch(fetchDevices())
  }, [])
  useEffect(() => {
    void dispatch(fetchButtons({ remoteId: selectedRemote ?? '' }))
  }, [selectedRemote])

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
}
